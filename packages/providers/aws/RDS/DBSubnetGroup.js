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
} = require("rubico");
const { find, first, defaultsDeep, isEmpty, size, pluck } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "DBSubnetGroup",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  buildTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.DBSubnetGroupName");
const findName = findId;

exports.DBSubnetGroup = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const rds = () => createEndpoint({ endpointName: "RDS" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Subnet",
      group: "EC2",
      ids: pipe([() => live, get("Subnets"), pluck("SubnetIdentifier")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBSubnetGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => rds().describeDBSubnetGroups(params),
      get("DBSubnetGroups"),
      map(
        assign({
          Tags: pipe([
            ({ DBSubnetGroupArn }) =>
              rds().listTagsForResource({ ResourceName: DBSubnetGroupArn }),
            get("TagList"),
          ]),
        })
      ),
    ])();

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      () => rds().describeDBSubnetGroups({ DBSubnetGroupName: id }),
      get("DBSubnetGroups"),
      first,
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name }) => getById({ id: name });

  const isInstanceUp = pipe([eq(get("SubnetGroupStatus"), "Complete")]);
  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSubnetGroup-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create: ${name}`);
        logger.debug(tos(payload));
      }),
      () => rds().createDBSubnetGroup(payload),
      get("DBSubnetGroup"),
      tap(({ DBSubnetGroupName }) =>
        retryCall({
          name: `key isUpById: ${name} id: ${DBSubnetGroupName}`,
          fn: () => isUpById({ name, id: DBSubnetGroupName }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created`);
      }),
    ])();

  //TODO
  const update = ({ name, payload, diff, live }) =>
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBSubnetGroup-property

  const destroy = ({ live }) =>
    pipe([
      () => ({ id: findId({ live }) }),
      ({ id }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id })}`);
          }),
          () => rds().deleteDBSubnetGroup({ DBSubnetGroupName: id }),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ id })}`);
          }),
        ])(),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { subnets },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        DBSubnetGroupName: name,
        SubnetIds: map((subnet) => getField(subnet, "SubnetId"))(subnets),
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
