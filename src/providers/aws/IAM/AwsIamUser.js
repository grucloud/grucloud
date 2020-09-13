const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get } = require("rubico");
const { defaultsDeep, isEmpty, forEach } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamUser" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { buildTags, findNameInTags } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = new AWS.IAM();

  const findName = (item) => findNameInTags(item);

  const findId = (item) => {
    assert(item);
    const id = item.UserName;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUsers-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${params}`);
      }),
      () => iam.listUsers(params).promise(),
      tap((users) => {
        logger.debug(`getList users: ${tos(users)}`);
      }),
      get("Users"),
      map.pool(
        20,
        pipe([
          tap((user) => {
            logger.debug(`getList user: ${tos(user)}`);
          }),
          async (user) => ({
            ...user,
            Tags: (
              await iam.listUserTags({ UserName: user.UserName }).promise()
            ).Tags,
          }),
          tap((user) => {
            logger.debug(user);
          }),
        ])
      ),
      (users) => ({
        total: users.length,
        items: users,
      }),
      tap((users) => {
        logger.debug(`getList results: ${tos(users)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam.getUser({ UserName: id }).promise(),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);

    const createParams = defaultsDeep({ Tags: buildTags({ name, config }) })(
      payload
    );

    const { User } = await iam.createUser(createParams).promise();
    logger.debug(`create result ${tos(User)}`);
    const { UserId, UserName } = User;

    return User;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        iam
          .listPolicies({
            MaxItems: 1e3,
            OnlyAttached: true,
            Scope: "Local",
          })
          .promise(),
      get("Policies"),
      forEach(async (policy) => {
        logger.debug(`destroy policy: ${policy.PolicyName}`);
        await iam
          .detachUserPolicy({
            PolicyArn: policy.Arn,
            UserName: id,
          })
          .promise();
        /*await iam
          .deleteUserPolicy({
            PolicyName: policy.PolicyName,
            UserName: id,
          })
          .promise();*/
      }),
      () =>
        iam
          .deleteUser({
            UserName: id,
          })
          .promise(),
      tap(() =>
        retryExpectOk({
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
    return defaultsDeep({ UserName: name, Path: "/" })(properties);
  };

  return {
    type: "IamUser",
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
