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
  not,
} = require("rubico");
const { defaultsDeep, first, size, isEmpty } = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");
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
const identity = require("rubico/x/identity");

const SubnetAttributes = [
  "MapPublicIpOnLaunch",
  "CustomerOwnedIpv4Pool",
  "MapCustomerOwnedIpOnLaunch",
  "MapPublicIpOnLaunch",
];

exports.AwsSubnet = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const isDefault = get("live.DefaultForAz");
  const cannotBeDeleted = isDefault;
  const managedByOther = isDefault;

  const findId = get("live.SubnetId");

  const findName = switchCase([
    get("live.DefaultForAz"),
    () => "subnet-default",
    findNameInTagsOrId({ findId }),
  ]);

  const findDependencies = ({ live }) => [
    {
      type: "Vpc",
      group: "ec2",
      ids: [live.VpcId],
    },
  ];

  const describeSubnets = (params = {}) =>
    pipe([
      tap(() => {
        logger.info(`describeSubnets ${JSON.stringify(params)}`);
      }),
      () => ec2().describeSubnets(params),
      get("Subnets"),
      tap((items) => {
        logger.debug(`describeSubnets result: ${tos(items)}`);
      }),
    ])();

  const getList = () => pipe([describeSubnets])();

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ id }) =>
    pipe([
      () => ({
        Filters: [
          {
            Name: "subnet-id",
            Values: [id],
          },
        ],
      }),
      describeSubnets,
      tap((params) => {
        assert(true);
      }),
      first,
    ])();

  const isUpById = pipe([getById, not(isEmpty)]);
  const isDownById = pipe([getById, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property

  const create = ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create subnet ${JSON.stringify({ name })}`);
        logger.debug(tos({ payload }));
      }),
      () => payload,
      omit(SubnetAttributes),
      ec2().createSubnet,
      get("Subnet.SubnetId"),
      tap((SubnetId) =>
        retryCall({
          name: `create subnet isDownById: ${name} SubnetId: ${SubnetId}`,
          fn: () => isUpById({ id: SubnetId }),
          config,
        })
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifySubnetAttribute-property
      tap((SubnetId) =>
        pipe([
          () => payload,
          pick(SubnetAttributes),
          filter(identity),
          map.entries(
            tryCatch(
              ([key, Value]) =>
                pipe([
                  () => ({ [key]: { Value }, SubnetId }),
                  tap((params) => {
                    logger.debug(
                      `modifySubnetAttribute ${JSON.stringify(params)}`
                    );
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
          tap((xxx) => {
            logger.debug(``);
          }),
          tap.if(any(get("error")), (results) => {
            throw Error(`modifySubnetAttribute error: ${tos(results)}`);
          }),
        ])()
      ),
      tap((SubnetId) => {
        logger.info(`created subnet ${JSON.stringify({ name, SubnetId })}`);
      }),
      (id) => ({ id }),
    ])();

  const destroy = ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy subnet ${JSON.stringify({ name, id })}`);
      }),
      () => destroyNetworkInterfaces({ ec2, Name: "subnet-id", Values: [id] }),
      () =>
        retryCall({
          name: `destroy subnet isDownById: ${name} id: ${id}`,
          fn: () => ec2().deleteSubnet({ SubnetId: id }),
          shouldRetryOnException: ({ error, name }) =>
            switchCase([
              eq(get("code"), "DependencyViolation"),
              () => true,
              () => false,
            ])(error),
          config: { retryCount: 10, retryDelay: 5e3 },
        }),
      tap(() =>
        retryCall({
          name: `destroy subnet isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed subnet ${JSON.stringify({ name, id })}`);
      }),
    ])();

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
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
