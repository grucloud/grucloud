const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  tryCatch,
  or,
  omit,
  switchCase,
} = require("rubico");
const { find, first, defaultsDeep, isEmpty, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "DBCluster",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  buildTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findId = get("live.DBClusterIdentifier");
const findName = findId;

exports.DBCluster = ({ spec, config }) => {
  const rds = () => createEndpoint({ endpointName: "RDS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      ids: [get("DBSubnetGroup")(live)],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => rds().describeDBClusters(params),
      get("DBClusters"),
      tap((results) => {
        logger.debug(`getList: result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: #total: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      tryCatch(
        pipe([
          () => rds().describeDBClusters({ DBClusterIdentifier: id }),
          get("DBClusters"),
          first,
        ]),
        switchCase([
          eq(get("code"), "DBClusterNotFoundFault"),
          () => undefined,
          (error) => {
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = pipe([eq(get("Status"), "available")]);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  const isDownById = ({ id }) => pipe([() => getById({ id }), isEmpty])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create: ${name}`);
        logger.debug(tos(payload));
      }),
      () => rds().createDBCluster(payload),
      get("DBCluster"),
      tap(({ DBClusterIdentifier }) =>
        retryCall({
          name: `key isUpById: ${name} id: ${DBClusterIdentifier}`,
          fn: () => isUpById({ name, id: DBClusterIdentifier }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created`);
      }),
    ])();

  //TODO
  const update = async ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => live,
      tap(() => {
        logger.info(`updated`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBCluster-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }) }),
      ({ id }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id })}`);
          }),
          () =>
            rds().deleteDBCluster({
              DBClusterIdentifier: id,
              SkipFinalSnapshot: true,
            }),
          tap(() =>
            retryCall({
              name: `isDownById ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ id })}`);
          }),
        ])(),
    ])();

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { dbSubnetGroup, dbSecurityGroups },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        DBClusterIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
          dbSecurityGroups
        ),
        Tags: buildTags({ config, namespace, name }),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareDBCluster = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareDBCluster ${tos(diff)}`);
  }),
]);
