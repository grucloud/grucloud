const assert = require("assert");
const {
  get,
  switchCase,
  pipe,
  tap,
  map,
  tryCatch,
  any,
  eq,
  omit,
  pick,
  filter,
} = require("rubico");
const { defaultsDeep, first, identity, isEmpty, prepend } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsSubnet" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTagsOrId,
  findNamespaceInTags,
  shouldRetryOnException,
  buildTags,
  destroyNetworkInterfaces,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const SubnetAttributes = [
  "MapPublicIpOnLaunch",
  "CustomerOwnedIpv4Pool",
  "MapCustomerOwnedIpOnLaunch",
  "MapPublicIpOnLaunch",
];

exports.AwsSubnet = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const isDefault = get("live.DefaultForAz");
  const cannotBeDeleted = isDefault;
  const managedByOther = isDefault;

  const findId = get("live.SubnetId");
  const pickId = pick(["SubnetId"]);

  const findName = switchCase([
    get("live.DefaultForAz"),
    pipe([get("live.AvailabilityZone", ""), prepend("subnet-default-")]),
    findNameInTagsOrId({ findId }),
  ]);

  const findDependencies = ({ live }) => [
    {
      type: "Vpc",
      group: "EC2",
      ids: [live.VpcId],
    },
  ];

  const getList = client.getList({
    method: "describeSubnets",
    getParam: "Subnets",
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ SubnetId }) =>
    pipe([
      tap(() => {
        assert(SubnetId);
      }),
      () => ({
        Filters: [
          {
            Name: "subnet-id",
            Values: [SubnetId],
          },
        ],
      }),
      //TODO use getList ?
      ec2().describeSubnets,
      get("Subnets"),
      first,
    ])();

  const modifySubnetAttribute = ({ SubnetId }) =>
    pipe([
      tap((params) => {
        assert(SubnetId);
      }),
      map.entries(
        tryCatch(
          ([key, Value]) =>
            pipe([
              () => ({ [key]: { Value }, SubnetId }),
              tap((params) => {
                logger.debug(`modifySubnetAttribute ${JSON.stringify(params)}`);
              }),
              ec2().modifySubnetAttribute,
              () => [key, Value],
            ])(),
          (error, [key]) =>
            pipe([
              tap(() => {
                logger.error(
                  `modifySubnetAttribute ${JSON.stringify({
                    error,
                    key,
                  })}`
                );
              }),
              () => [key, { error: { error } }],
            ])()
        )
      ),
      tap((params) => {
        assert(true);
      }),
      tap.if(any(get("error")), (results) => {
        throw Error(`modifySubnetAttribute error: ${tos(results)}`);
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property
  const create = client.create({
    method: "createSubnet",
    filterPayload: omit(SubnetAttributes),
    pickCreated: (payload) => (result) =>
      pipe([() => result, get("Subnet"), pickId])(),
    pickId,
    getById,
    postCreate:
      ({ payload }) =>
      ({ SubnetId }) =>
        pipe([
          tap(() => {
            assert(SubnetId);
          }),
          () => payload,
          pick(SubnetAttributes),
          filter(identity),
          modifySubnetAttribute({ SubnetId }),
        ])(),
    config,
  });

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update subnet: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => diff.liveDiff.updated,
      modifySubnetAttribute({ SubnetId: live.SubnetId }),
      tap(() => {
        logger.info(`updated subnet ${name}`);
      }),
    ])();

  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live: { SubnetId } }) =>
      destroyNetworkInterfaces({ ec2, Name: "subnet-id", Values: [SubnetId] }),
    shouldRetryOnException: switchCase([
      eq(get("error.code"), "DependencyViolation"),
      () => true,
      () => false,
    ]),
    method: "deleteSubnet",
    getById,
    ignoreErrorCodes: ["InvalidSubnetID.NotFound"],
    config,
  });

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        ...(vpc && { VpcId: getField(vpc, "VpcId") }),
        TagSpecifications: [
          {
            ResourceType: "subnet",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])();

  return {
    spec,
    isDefault,
    cannotBeDeleted,
    managedByOther,
    findId,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getList,
    create,
    update,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
