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
  pick,
  switchCase,
} = require("rubico");
const { find, first, defaultsDeep, isEmpty, size, pluck } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { getField } = require("@grucloud/core/ProviderCommon");

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

const omitParams = ["Engine", "MasterUsername", "Tags"];

const findId = get("live.DBInstanceIdentifier");
const findName = findId;

exports.DBInstance = ({ spec, config }) => {
  const rds = () => createEndpoint({ endpointName: "RDS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      group: "rds",
      ids: [get("DBSubnetGroup.DBSubnetGroupName")(live)],
    },
    {
      type: "SecurityGroup",
      group: "ec2",
      ids: pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")])(live),
    },
    {
      type: "Key",
      group: "kms",
      ids: [live.KmsKeyId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBInstances-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => rds().describeDBInstances(params),
      get("DBInstances"),
    ])();

  const getByName = getByNameCore({ getList, findName });

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBInstance-property
  const update = async ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => ({
        ...diff.liveDiff.updated,
        ...pick(["DBInstanceIdentifier"])(live),
      }),
      tap((params) => {
        logger.debug(tos(params));
      }),
      (params) => rds().modifyDBInstance(params),
      tap(() => {
        logger.info(`updated`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBInstance-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }) }),
      ({ id }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id })}`);
          }),
          () => live,
          tap.if(not(eq(get("DBInstanceStatus"), "deleting")), () =>
            rds().deleteDBInstance({
              DBInstanceIdentifier: id,
              SkipFinalSnapshot: true,
            })
          ),
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
    dependencies: { dbSubnetGroup, securityGroups, kmsKey },
  }) =>
    pipe([
      tap(() => {
        assert(
          !isEmpty(properties.MasterUserPassword),
          "MasterUserPassword is empty"
        );
      }),
      () => properties,
      defaultsDeep({
        DBInstanceIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
          securityGroups
        ),
        ...(kmsKey && { KmsKeyId: getField(kmsKey, "Arn") }),
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

const filterTarget = ({ target }) => pipe([() => target, omit(omitParams)])();
const filterLive = ({ live }) => pipe([() => live, omit(omitParams)])();

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
