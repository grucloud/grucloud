const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, filter } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");
const moment = require("moment");
const logger = require("../../../logger")({ prefix: "IamPolicy" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { buildTags, findNameInDescription } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamPolicy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = new AWS.IAM();

  const findName = (item) =>
    findNameInDescription({ Description: item.Description });

  const findId = (item) => {
    assert(item);
    const id = item.Arn;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listPolicies-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${params}`);
      }),
      () => iam.listPolicies({ ...params, MaxItems: 1e3 }).promise(),
      tap(({ Policies }) => {
        logger.debug(`getList: ${Policies.length}`);
      }),
      get("Policies"),
      filter((policy) => moment(policy.CreateDate).isAfter("2020-09-11")),
      tap((policies) => {
        logger.debug(`getList: ${policies.length}`);
      }),
      map.pool(
        20,
        pipe([
          tap((policy) => {
            logger.debug(`getList policy: ${tos(policy)}`);
          }),
          (policy) => iam.getPolicy({ PolicyArn: policy.Arn }).promise(),
          get("Policy"),
          tap((policy) => {
            logger.debug(policy);
          }),
        ])
      ),
      tap((policy) => {
        logger.debug(`getList policy: ${tos(policy)}`);
      }),
      (policies) => ({
        total: policies.length,
        items: policies,
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam.getPolicy({ PolicyArn: id }).promise(),
      (error) => {
        logger.debug(`getById error: ${tos(error)}`);
        if (error.code !== "NoSuchEntity") {
          throw error;
        }
      }
    ),
    tap((result) => {
      logger.debug(`getById result: ${result}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);

    const createParams = {
      ...payload,
      Description: `${payload.Description}, tags:${JSON.stringify(
        buildTags({ name, config })
      )}`,
    };

    const { Policy } = await iam.createPolicy(createParams).promise();

    logger.debug(`create result ${tos(Policy)}`);

    return Policy;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deletePolicy-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ name, id })}`);
    assert(!isEmpty(id), `destroy invalid id`);

    const deleteParams = {
      PolicyArn: id,
    };
    const result = await iam.deletePolicy(deleteParams).promise();

    logger.debug(`destroy in progress, ${tos({ name, id })}`);

    await retryExpectOk({
      name: `isDownById: ${name} id: ${id}`,
      fn: () => isDownById({ id }),
      config,
    });

    logger.debug(`destroy done, ${tos({ name, id, result })}`);
    return result;
  };

  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ dependencies })}`);
    return defaultsDeep({ PolicyName: name, Path: "/" })(properties);
  };

  return {
    type: "IamPolicy",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};

exports.isOurMinionIamPolicy = ({ resource, config }) => {
  assert(resource);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  assert(managedByValue);

  const tags = resource.Description?.split("tags:")[1];
  let minion = false;
  if (tags) {
    try {
      const tagsJson = JSON.parse(tags);

      if (
        tagsJson.find(
          (tag) => tag.Key === managedByKey && tag.Value === managedByValue
        )
      ) {
        minion = true;
      }
    } catch (error) {
      logger.error(`isOurMinionIamPolicy ${error}`);
    }
  }
  return minion;
};
