const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  any,
  all,
  tryCatch,
  switchCase,
} = require("rubico");
const { isEmpty, defaultsDeep, pluck, prepend } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "EC2RouteTable" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
  findNamespaceInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

exports.EC2RouteTable = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const { providerName } = config;
  const ec2 = Ec2New(config);
  const findId = get("live.RouteTableId");

  const isDefault = ({ live, lives }) =>
    pipe([() => live, get("Associations"), any(get("Main"))])();

  const findDefaultName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.VpcId);
        assert(lives);
      }),
      () =>
        lives.getById({
          type: "Vpc",
          group: "EC2",
          providerName,
          id: live.VpcId,
        }),
      tap((vpc) => {
        assert(vpc);
      }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      prepend("rt-default-"),
    ])();

  const findName = pipe([
    switchCase([isDefault, findDefaultName, findNameInTagsOrId({ findId })]),
    tap((name) => {
      logger.debug(`findName: ${name}`);
    }),
  ]);

  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "EC2", ids: [live.VpcId] },
    {
      type: "Subnet",
      group: "EC2",
      ids: pipe([
        () => live,
        get("Associations"),
        pluck("SubnetId"),
        filter(not(isEmpty)),
      ])(),
    },
  ];

  const routesDelete = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => live,
      get("Routes"),
      filter(eq(get("State"), "blackhole")),
      tap((Routes) => {
        assert(true);
      }),
      map(
        tryCatch(
          pipe([
            tap((Route) => {
              assert(Route);
            }),
            (Route) =>
              ec2().deleteRoute({
                RouteTableId: live.RouteTableId,
                DestinationCidrBlock: Route.DestinationCidrBlock,
              }),
          ]),
          (error, Route) =>
            pipe([
              tap(() => {
                logger.error(`error deleteRoute ${tos({ Route, error })}`);
              }),
              () => ({ error, Route }),
            ])()
        )
      ),
      tap.if(any(get("error")), (result) => {
        throw result;
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = client.getList({
    method: "describeRouteTables",
    getParam: "RouteTables",
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "RouteTableIds", getList });
  const isUpById = isUpByIdCore({ getById });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create rt ${tos({ name })}`);
      }),
      () => ec2().createRouteTable(payload),
      get("RouteTable"),
      tap(({ RouteTableId }) =>
        retryCall({
          name: `create rt isUpById: ${name} id: ${RouteTableId}`,
          fn: () => isUpById({ id: RouteTableId, name }),
          config,
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route table ${JSON.stringify({ name, id })}`);
        assert(live);
        assert(id);
      }),
      () => routesDelete({ live }),
      () => ec2().deleteRouteTable({ RouteTableId: id }),
      tap(() =>
        retryCall({
          name: `destroy rt isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id, name }),
          config,
        })
      ),
      tap(() => {
        logger.info(`rt destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otheProps },
    dependencies: { vpc },
  }) =>
    pipe([
      tap(() => {
        assert(vpc, "RouteTable is missing the dependency 'vpc'");
      }),
      () => otheProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "route-table",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])();

  const cannotBeDeleted = isDefault;

  return {
    spec,
    isDefault,
    managedByOther: isDefault,
    findId,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getById,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
