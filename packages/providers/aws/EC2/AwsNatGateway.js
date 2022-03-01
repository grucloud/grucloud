const {
  get,
  pipe,
  filter,
  map,
  or,
  tap,
  eq,
  not,
  pick,
  tryCatch,
} = require("rubico");
const { defaultsDeep, isEmpty, pluck, find, size } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({ prefix: "AwsNatGateway" });
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  Ec2New,
  getByIdCore,
  findNameInTagsOrId,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

exports.AwsNatGateway = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const findId = get("live.NatGatewayId");
  const pickId = pick(["NatGatewayId"]);

  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Subnet",
      group: "EC2",
      ids: [live.SubnetId],
    },
    {
      type: "NetworkInterface",
      group: "EC2",
      ids: pipe([
        () => live,
        get("NatGatewayAddresses"),
        pluck("NetworkInterfaceId"),
      ])(),
    },
    {
      type: "ElasticIpAddress",
      group: "EC2",
      ids: pipe([
        () => live,
        get("NatGatewayAddresses"),
        pluck("AllocationId"),
        map((AllocationId) =>
          pipe([
            () =>
              lives.getByType({
                type: "ElasticIpAddress",
                group: "EC2",
                providerName: config.providerName,
              }),
            find(eq(get("live.AllocationId"), AllocationId)),
            get("id"),
          ])()
        ),
      ])(),
    },
  ];
  //TODO handle deleting
  const isInstanceDown = or([isEmpty, eq(get("State"), "deleted")]);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNatGateways-property

  const getList = client.getList({
    method: "describeNatGateways",
    getParam: "NatGateways",
    filterResource: not(isInstanceDown),
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ NatGatewayId }) => ({ id: NatGatewayId }),
    getByIdCore({ fieldIds: "NatGatewayIds", getList }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNatGateway-property
  const create = client.create({
    method: "createNatGateway",
    pickCreated: () => (result) => pipe([() => result, get("NatGateway")])(),
    pickId,
    isInstanceUp: eq(get("State"), "available"),
    getById,
    config,
  });

  const disassociateAddress = (live) =>
    pipe([
      () => live,
      get("NatGatewayAddresses"),
      tap((NatGatewayAddresses) => {
        logger.info(
          `destroy nat #NatGatewayAddresses ${size(NatGatewayAddresses)}`
        );
      }),
      map(
        pipe([
          ({ AllocationId }) => {
            ec2().describeAddresses({
              Filters: [
                {
                  Name: "allocation-id",
                  Values: [AllocationId],
                },
              ],
            });
          },
          get("Addresses"),
          map(
            tryCatch(
              pipe([pick(["AssociationId"]), ec2().disassociateAddress]),
              (error, address) =>
                pipe([
                  tap(() => {
                    logger.error(`error disassociateAddress  ${tos(error)}`);
                  }),
                  () => ({ error, address }),
                ])()
            )
          ),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNatGateway-property
  const destroy = client.destroy({
    pickId,
    preDestroy: disassociateAddress,
    method: "deleteNatGateway",
    getById,
    isInstanceDown,
    ignoreErrorCodes: ["NatGatewayNotFound"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { eip, subnet },
  }) =>
    pipe([
      tap(() => {
        assert(eip, "NatGateway is missing the dependency 'eip'");
        assert(subnet, "NatGateway is missing the dependency 'subnet'");
      }),
      () => properties,
      defaultsDeep({
        AllocationId: getField(eip, "AllocationId"),
        SubnetId: getField(subnet, "SubnetId"),
        TagSpecifications: [
          {
            ResourceType: "natgateway",
            Tags: buildTags({ config, namespace, name }),
          },
        ],
      }),
    ])();

  return {
    spec,
    findId,
    getByName,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
