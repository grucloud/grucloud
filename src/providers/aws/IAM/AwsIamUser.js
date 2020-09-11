const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamUser" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { KeyName, findNameInTags } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

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
      ({ Users }) => Users,
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

    const createParams = defaultsDeep({
      Tags: [
        {
          Key: KeyName,
          Value: name,
        },
        {
          Key: managedByKey,
          Value: managedByValue,
        },
        {
          Key: stageTagKey,
          Value: stage,
        },
      ],
    })(payload);

    const { User } = await iam.createUser(createParams).promise();
    logger.debug(`create result ${tos(User)}`);
    const { UserId, UserName } = User;

    //TODO
    /*
    CheckTagsIAM({
      config,
      tags: instanceUp.Instances[0].Tags,
      name,
    });
*/
    return User;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ name, id })}`);
    assert(!isEmpty(id), `destroy invalid id`);

    const deleteParams = {
      UserName: id,
    };
    const result = await iam.deleteUser(deleteParams).promise();

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
