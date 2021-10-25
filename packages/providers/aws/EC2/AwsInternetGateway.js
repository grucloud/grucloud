const {
  pipe,
  filter,
  map,
  get,
  tap,
  eq,
  switchCase,
  not,
  tryCatch,
  any,
} = require("rubico");
const {
  find,
  defaultsDeep,
  isEmpty,
  first,
  pluck,
  includes,
} = require("rubico/x");
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
  findNamespaceInTags,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findVpcId = pipe([get("Attachments"), first, get("VpcId")]);

const isDefault =
  ({ providerName }) =>
  ({ live, lives }) =>
    pipe([
      () => lives.getByType({ type: "Vpc", group: "EC2", providerName }),
      find(get("isDefault")),
      switchCase([
        eq(get("live.VpcId"), findVpcId(live)),
        () => true,
        () => false,
      ]),
    ])();

exports.isDefault = isDefault;

exports.AwsInternetGateway = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const findId = get("live.InternetGatewayId");
  //TODO use default
  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live }) => [
    {
      type: "Vpc",
      group: "EC2",
      ids: pipe([() => live, get("Attachments"), pluck("VpcId")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInternetGateways-property

  // const getList = client.getList({
  //   method: "describeInternetGateways",
  //   getParam: "InternetGateways",
  // });

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ig ${JSON.stringify(params)}`);
      }),
      () => params,
      ec2().describeInternetGateways,
      get("InternetGateways"),
    ])();

  const getByName = getByNameCore({ getList, findName });
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

  const create = ({ payload, name, resolvedDependencies: { vpc } }) =>
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
              () => error,
              tap(() => {
                // "Network vpc-xxxxxxx has some mapped public address(es). Please unmap those public address(es) before detaching the gateway."
                logger.error(`detachInternetGateway ${name}: ${tos(error)}`);
              }),
              eq(get("code"), "DependencyViolation"),
            ])(),
          config: { retryCount: 10, retryDelay: 5e3 },
        }),
    ])();

  const detachInternetGateways = ({ InternetGatewayId }) =>
    pipe([
      tap(() => {
        assert(InternetGatewayId);
      }),
      //TODO use live
      () => getById({ id: InternetGatewayId }),
      get("Attachments"),
      map(
        tryCatch(
          pipe([
            get("VpcId"),
            tap((VpcId) => {
              assert(VpcId);
            }),
            (VpcId) => detachInternetGateway({ InternetGatewayId, VpcId }),
          ]),
          (error, Attachment) =>
            pipe([
              tap(() => {
                logger.error(
                  `error associateRouteTable ${tos({
                    Attachment,
                    error,
                  })}`
                );
              }),
              () => ({ error, InternetGatewayId, Attachment }),
            ])()
        )
      ),
      tap.if(any(get("error")), (results) => {
        throw results;
      }),
    ])();

  const destroy = async ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ig ${JSON.stringify({ name, id })}`);
        assert(live);
        assert(id);
      }),
      () => detachInternetGateways({ InternetGatewayId: id }),
      tryCatch(
        pipe([
          // TODO InvalidInternetGatewayID.NotFound
          () => ec2().deleteInternetGateway({ InternetGatewayId: id }),
          () =>
            retryCall({
              name: `destroy ig isDownById: ${name} id: ${id}`,
              fn: () => isDownById({ id }),
              config,
            }),
        ]),
        (error) =>
          pipe([
            tap(() => {
              logger.error(`error destroying ig ${tos({ name, id, error })}`);
            }),
            () => error,
            switchCase([
              eq(get("code"), "AuthFailure"),
              () => undefined,
              (error) => {
                throw error;
              },
            ]),
          ])()
      ),
      tap(() => {
        logger.debug(`destroyed ig ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = ({ name, namespace, properties = {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "internet-gateway",
            Tags: buildTags({ config, namespace, name }),
          },
        ],
      }),
    ])();

  return {
    spec,
    findId,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    isDefault: isDefault(config),
    cannotBeDeleted: isDefault(config),
    managedByOther: isDefault(config),
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
