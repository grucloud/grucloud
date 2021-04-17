const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");
const { defaultsDeep, isEmpty, first, pluck } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({ prefix: "AwsIgw" });
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
} = require("../AwsCommon");

exports.AwsInternetGateway = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findId = get("InternetGatewayId");
  const findName = (item) => findNameInTagsOrId({ item, findId });

  const findDependencies = ({ live }) => [
    {
      type: "Vpc",
      ids: pipe([() => live, get("Attachments"), pluck("VpcId")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInternetGateways-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ig ${JSON.stringify(params)}`);
      }),
      () => ec2().describeInternetGateways(params),
      get("InternetGateways"),
      tap((items) => {
        logger.debug(`getList ig result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #ig ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "InternetGatewayIds", getList });

  const getStateName = pipe([
    get("Attachments"),
    first,
    get("State"),
    tap((State) => {
      logger.info(`ig stateName ${State}`);
    }),
  ]);

  const isInstanceUp = eq(getStateName, "available");
  const isUpById = isUpByIdCore({
    getById,
    isInstanceUp,
  });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createInternetGateway-property

  const create = async ({ payload, name, resolvedDependencies: { vpc } }) =>
    pipe([
      tap(() => {
        logger.info(`create ig ${tos({ name })}`);
        assert(vpc, "InternetGateway is missing the dependency 'vpc'");
      }),
      () => ec2().createInternetGateway(payload),
      get("InternetGateway.InternetGatewayId"),
      tap((InternetGatewayId) =>
        pipe([
          () =>
            ec2().attachInternetGateway({
              InternetGatewayId,
              VpcId: vpc.live.VpcId,
            }),
          () =>
            retryCall({
              name: `ig create isUpById: ${name} id: ${InternetGatewayId}`,
              fn: () => isUpById({ id: InternetGatewayId }),
              config,
            }),
        ])()
      ),
      tap((InternetGatewayId) => {
        logger.info(`created ig ${tos({ name, InternetGatewayId })}`);
      }),
      (InternetGatewayId) => ({ id: InternetGatewayId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachInternetGateway-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteInternetGateway-property

  const detachInternetGateway = ({ InternetGatewayId, VpcId }) =>
    pipe([
      () => ec2().describeAddresses({}),
      get("Addresses"),
      tap((Addresses) => {
        logger.debug(`destroy ig describeAddresses ${tos({ Addresses })}`);
      }),
      () =>
        retryCall({
          name: `destroy ig detachInternetGateway ${InternetGatewayId}, VpcId: ${VpcId}`,
          fn: () =>
            ec2().detachInternetGateway({
              InternetGatewayId,
              VpcId,
            }),
          shouldRetryOnException: ({ error, name }) =>
            pipe([
              tap((error) => {
                // "Network vpc-xxxxxxx has some mapped public address(es). Please unmap those public address(es) before detaching the gateway."
                logger.error(`detachInternetGateway ${name}: ${tos(error)}`);
              }),
              eq(get("code"), "DependencyViolation"),
            ])(error),
          config: { retryCount: 10, retryDelay: 5e3 },
        }),
    ])();

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ig ${tos({ name, id })}`);
      }),
      () => getById({ id }),
      get("Attachments"),
      first, //TODO forEach
      tap((Attachments) => {
        logger.debug(`destroy ig ${tos({ Attachments })}`);
      }),
      tap.if(not(isEmpty), ({ VpcId }) =>
        detachInternetGateway({ InternetGatewayId: id, VpcId })
      ),
      () => ec2().deleteInternetGateway({ InternetGatewayId: id }),
      () =>
        retryCall({
          name: `destroy ig isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.debug(`destroyed ig ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "internet-gateway",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

  //TODO
  const cannotBeDeleted = ({ resource, name }) => {
    logger.debug(`cannotBeDeleted name: ${name} ${tos({ resource })}`);
    return resource.InternetGatewayId === name;
  };

  return {
    type: "InternetGateway",
    spec,
    findId,
    findName,
    findDependencies,
    isInstanceUp,
    getByName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
