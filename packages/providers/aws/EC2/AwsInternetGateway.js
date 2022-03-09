const {
  pipe,
  map,
  get,
  tap,
  eq,
  switchCase,
  tryCatch,
  any,
  pick,
  not,
} = require("rubico");
const { find, defaultsDeep, first, pluck, isEmpty } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({ prefix: "AwsIgw" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  getByIdCore,
  findNameInTagsOrId,
  buildTags,
  findNamespaceInTags,
  isAwsError,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, updateTags } = require("./EC2Common");

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
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const pickId = pick(["InternetGatewayId"]);
  const findId = get("live.InternetGatewayId");

  const findName = pipe([
    switchCase([
      isDefault(config),
      () => "ig-default",
      findNameInTagsOrId({ findId }),
    ]),
  ]);

  const findDependencies = ({ live }) => [
    {
      type: "Vpc",
      group: "EC2",
      ids: pipe([() => live, get("Attachments"), pluck("VpcId")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInternetGateways-property
  const getList = client.getList({
    method: "describeInternetGateways",
    getParam: "InternetGateways",
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ InternetGatewayId }) => ({ id: InternetGatewayId }),
    getByIdCore({ fieldIds: "InternetGatewayIds", getList }),
  ]);

  const getStateName = pipe([
    get("Attachments"),
    first,
    get("State"),
    tap((State) => {
      logger.debug(`ig stateName ${State}`);
    }),
  ]);

  const isAttached = eq(getStateName, "available");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createInternetGateway-property
  const create = client.create({
    method: "createInternetGateway",
    pickCreated: () => get("InternetGateway"),
    getById,
    postCreate:
      ({ resolvedDependencies: { vpc } }) =>
      ({ InternetGatewayId }) =>
        pipe([
          () => ({
            InternetGatewayId,
            VpcId: vpc.live.VpcId,
          }),
          ec2().attachInternetGateway,
          () =>
            retryCall({
              name: `attachInternetGateway ${InternetGatewayId}`,
              fn: pipe([() => ({ InternetGatewayId }), getById, isAttached]),
              isExpectedResult: not(isEmpty),
              config: { retryCount: 20, retryDelay: 5e3 },
            }),
        ])(),
  });

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
              isAwsError("DependencyViolation"),
            ])(),
          config: { retryCount: 10, retryDelay: 5e3 },
        }),
    ])();

  const detachInternetGateways = ({ live: { InternetGatewayId } }) =>
    pipe([
      tap(() => {
        assert(InternetGatewayId);
      }),
      () => getById({ InternetGatewayId }),
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

  const destroy = client.destroy({
    preDestroy: detachInternetGateways,
    pickId,
    method: "deleteInternetGateway",
    getById,
    ignoreErrorCodes: ["InvalidInternetGatewayID.NotFound"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TagSpecifications: [
          {
            ResourceType: "internet-gateway",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
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
    updateTags: updateTags({ ec2 }),
  };
};
