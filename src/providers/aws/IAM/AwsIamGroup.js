const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamGroup" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { shouldRetryOnException } = require("../AwsCommon");

const findName = get("GroupName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = new AWS.IAM();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${tos(params)}`);
      }),
      () => iam.listGroups(params).promise(),
      tap((groups) => {
        logger.debug(`getList groups: ${tos(groups)}`);
      }),
      get("Groups"),
      (groups) => ({
        total: groups.length,
        items: groups,
      }),
      tap((groups) => {
        logger.debug(`getList results: ${tos(groups)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam.getGroup({ GroupName: id }).promise(),
      switchCase([
        (error) => error.code !== "NoSuchEntity",
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchEntity`);
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${result}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);

    const createParams = defaultsDeep({})(payload);

    const { Group } = await iam.createGroup(createParams).promise();
    logger.debug(`create result ${tos(Group)}`);
    return Group;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        iam
          .listAttachedGroupPolicies({ GroupName: id, MaxItems: 1e3 })
          .promise(),
      get("AttachedPolicies"),
      forEach(async (policy) => {
        await iam
          .detachGroupPolicy({
            PolicyArn: policy.PolicyArn,
            GroupName: id,
          })
          .promise();
      }),
      () =>
        iam
          .deleteGroup({
            GroupName: id,
          })
          .promise(),
      tap(() =>
        retryCall({
          name: `isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroy done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ dependencies })}`);
    return defaultsDeep({ GroupName: name, Path: "/" })(properties);
  };

  return {
    type: "IamGroup",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};

exports.isOurMinionIamGroup = ({ resource, resourceNames }) => {
  assert(resource);
  assert(resourceNames, "resourceNames");
  const isOur = resourceNames.includes(resource.GroupName);
  logger.debug(`isOurMinionIamGroup: ${isOur}`);
  return isOur;
};
