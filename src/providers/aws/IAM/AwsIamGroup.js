const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, switchCase, eq } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamGroup" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  IAMNew,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");

const findName = get("GroupName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList group ${tos(params)}`);
      }),
      () => iam().listGroups(params),
      get("Groups"),
      tap((groups) => {
        logger.debug(`getList groups: ${tos(groups)}`);
      }),
      (groups) => ({
        total: groups.length,
        items: groups,
      }),
      tap(({ total }) => {
        logger.info(`getList #groups: ${tos(total)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getGroup({ GroupName: id }),
      switchCase([
        eq(get("code"), "NoSuchEntity"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchEntity`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
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

  const create = async ({ name, payload = {}, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create iam group ${tos({ name, payload })}`);
      }),
      () => iam().createGroup(payload),
      get("Group"),
      tap((Group) => {
        logger.info(`created iam group ${tos({ name, Group })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam group ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => iam().listAttachedGroupPolicies({ GroupName: id, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      forEach((policy) => {
        iam().detachGroupPolicy({
          PolicyArn: policy.PolicyArn,
          GroupName: id,
        });
      }),
      () =>
        iam().deleteGroup({
          GroupName: id,
        }),
      tap(() =>
        retryCall({
          name: `iam group isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed iam group, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ GroupName: name, Path: "/" })(properties);

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
    shouldRetryOnExceptionDelete,
  };
};

exports.isOurMinionIamGroup = ({ resource, resourceNames }) => {
  assert(resource);
  assert(resourceNames, "resourceNames");
  const isOur = resourceNames.includes(resource.GroupName);
  logger.debug(`isOurMinionIamGroup: ${isOur}`);
  return isOur;
};
