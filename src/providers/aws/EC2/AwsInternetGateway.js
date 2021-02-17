const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");
const { defaultsDeep, isEmpty, first } = require("rubico/x");
const assert = require("assert");

const logger = require("../../../logger")({ prefix: "AwsIgw" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
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

  const isUpById = isUpByIdCore({
    getById,
    isInstanceUp: eq(getStateName, "available"),
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

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ig ${tos({ name, id })}`);
      }),
      () => getById({ id }),
      get("Attachments"),
      first,
      tap((Attachments) => {
        logger.debug(`destroy ig ${tos({ Attachments })}`);
      }),
      tap.if(not(isEmpty), ({ VpcId }) =>
        retryCall({
          name: `destroy ig detachInternetGateway: ${name} VpcId: ${VpcId}`,
          fn: () =>
            ec2().detachInternetGateway({
              InternetGatewayId: id,
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
        })
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
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
