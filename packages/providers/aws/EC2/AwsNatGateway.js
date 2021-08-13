const {
  get,
  pipe,
  filter,
  map,
  tap,
  eq,
  switchCase,
  not,
  pick,
  tryCatch,
} = require("rubico");
const { defaultsDeep, isEmpty, pluck, find, size } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({ prefix: "AwsNatGateway" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  getByIdCore,
  findNameInTagsOrId,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

exports.AwsNatGateway = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = get("live.NatGatewayId");

  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Subnet",
      group: "ec2",
      ids: [live.SubnetId],
    },
    {
      type: "NetworkInterface",
      group: "ec2",
      ids: pipe([
        () => live,
        get("NatGatewayAddresses"),
        pluck("NetworkInterfaceId"),
      ])(),
    },
    {
      type: "ElasticIpAddress",
      group: "ec2",
      ids: pipe([
        () => live,
        get("NatGatewayAddresses"),
        pluck("AllocationId"),
        map(
          (AllocationId) =>
            pipe([
              () =>
                lives.getByType({
                  type: "ElasticIpAddress",
                  group: "ec2",
                  providerName: config.providerName,
                }),
              find(eq(get("live.AllocationId"), AllocationId)),
              get("id"),
            ])(),
          filter(not(isEmpty))
        ),
      ])(),
    },
  ];

  const isInstanceUp = eq(get("State"), "available");
  const isInstanceDown = eq(get("State"), "deleted");
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNatGateways-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList nat ${JSON.stringify(params)}`);
      }),
      () => ec2().describeNatGateways(params),
      get("NatGateways"),
      filter(not(isInstanceDown)),
      tap((items) => {
        logger.debug(`getList nat result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #nat ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "NatGatewayIds", getList });

  const isUpById = isUpByIdCore({
    getById,
    isInstanceUp,
  });

  const isDownById = isDownByIdCore({
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNatGateway-property

  const create = ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create nat ${tos({ name })}`);
      }),
      () => ec2().createNatGateway(payload),
      get("NatGateway"),
      tap((NatGateway) => {
        logger.info(`nat created ${tos(NatGateway)}`);
      }),
      ({ NatGatewayId }) =>
        retryCall({
          name: `nat isUpById: ${name} id: ${NatGatewayId}`,
          fn: () => isUpById({ name, id: NatGatewayId }),
          config: { retryCount: 12 * 5, repeatDelay: 5e3 },
        }),
      ({ NatGatewayId }) => ({ id: NatGatewayId }),
    ])();

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
              pipe([
                pick(["AssociationId"]),
                tap((params) => {
                  assert(true);
                }),
                ec2().disassociateAddress,
              ]),
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
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy nat ${live.NatGatewayId}`);
      }),
      () => live,
      tap(disassociateAddress),
      pick(["NatGatewayId"]),
      tap(
        tryCatch(
          ec2().deleteNatGateway,
          switchCase([
            eq(get("code"), "NatGatewayNotFound"),
            () => null,
            (error) => {
              throw error;
            },
          ])
        )
      ),
      tap(({ NatGatewayId }) =>
        retryCall({
          name: `destroy nat gateway isDownById: ${NatGatewayId}`,
          fn: () => isDownById({ id: NatGatewayId, name }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroyed nat ${JSON.stringify({ name })}`);
      }),
    ])();

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
