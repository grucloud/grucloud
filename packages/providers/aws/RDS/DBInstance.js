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

const logger = require("@grucloud/core/logger")({
  prefix: "DBInstance",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  buildTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findId = get("DBInstanceIdentifier");
const findName = findId;

exports.DBInstance = ({ spec, config }) => {
  const rds = () => createEndpoint({ endpointName: "RDS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      ids: [get("DBSubnetGroup.DBSubnetGroupName")(live)],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBInstances-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => rds().describeDBInstances(params),
      get("DBInstances"),
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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      tryCatch(
        pipe([
          () => rds().describeDBInstances({ DBInstanceIdentifier: id }),
          get("DBInstances"),
          first,
        ]),
        switchCase([
          eq(get("code"), "DBInstanceNotFound"),
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

  const isInstanceUp = pipe([eq(get("DBInstanceStatus"), "available")]);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  const isDownById = ({ id }) => pipe([() => getById({ id }), isEmpty])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create: ${name}`);
        logger.debug(tos(payload));
      }),
      () => rds().createDBInstance(payload),
      get("DBInstance"),
      tap(({ DBInstanceIdentifier }) =>
        retryCall({
          name: `key isUpById: ${name} id: ${DBInstanceIdentifier}`,
          fn: () => isUpById({ name, id: DBInstanceIdentifier }),
          config: { ...config, retryCount: 100 },
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBInstance-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live) }),
      ({ id }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id })}`);
          }),
          () =>
            rds().deleteDBInstance({
              DBInstanceIdentifier: id,
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
    dependencies: { dbSubnetGroup },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        DBInstanceIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        Tags: buildTags({ config, namespace, name }),
      }),
    ])();

  return {
    type: "DBInstance",
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

exports.compareDBInstance = pipe([
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
    logger.debug(`compareDBInstance ${tos(diff)}`);
  }),
]);
