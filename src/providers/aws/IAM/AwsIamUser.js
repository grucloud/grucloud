const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamUser" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  IAMNew,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = findNameInTags;
  const findId = get("UserName");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUsers-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList iam user`);
      }),
      () => iam().listUsers(params).promise(),
      tap((users) => {
        logger.debug(`getList users: ${tos(users)}`);
      }),
      get("Users"),
      map.pool(
        20,
        pipe([
          tap((user) => {
            logger.debug(`getList user: ${tos(user)}`);
          }), //TODO use assign
          async (user) => ({
            ...user,
            AttachedPolicies: await pipe([
              () =>
                iam()
                  .listAttachedUserPolicies({
                    UserName: user.UserName,
                    MaxItems: 1e3,
                  })
                  .promise(),
              get("AttachedPolicies"),
              pluck("PolicyName"),
            ])(),
            Policies: await pipe([
              () =>
                iam()
                  .listUserPolicies({
                    UserName: user.UserName,
                    MaxItems: 1e3,
                  })
                  .promise(),
              get("Policies"),
              pluck("PolicyName"),
            ])(),
            Groups: await pipe([
              () =>
                iam().listGroupsForUser({ UserName: user.UserName }).promise(),
              get("Groups"),
              pluck("GroupName"),
            ])(),
            Tags: (
              await iam().listUserTags({ UserName: user.UserName }).promise()
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
        logger.info(`getList #results: ${tos(users.total)}`);
        logger.debug(`getList results: ${tos(users)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getUser({ UserName: id }).promise(),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);

    const createParams = defaultsDeep({ Tags: buildTags({ name, config }) })(
      payload
    );

    const { User } = await iam().createUser(createParams).promise();
    const { iamGroups } = dependencies;
    if (iamGroups) {
      await forEach((group) =>
        iam()
          .addUserToGroup({ GroupName: group.name, UserName: name })
          .promise()
      )(iamGroups);
    }

    logger.debug(`create result ${tos(User)}`);
    return User;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam user ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => iam().listGroupsForUser({ UserName: id }).promise(),
      get("Groups"),
      tap((Groups = []) => {
        logger.debug(`destroy iam user Groups: ${Groups.length}`);
      }),
      forEach((group) => {
        iam()
          .removeUserFromGroup({
            GroupName: group.GroupName,
            UserName: id,
          })
          .promise();
      }),
      () =>
        iam()
          .listAttachedUserPolicies({ UserName: id, MaxItems: 1e3 })
          .promise(),
      get("AttachedPolicies"),
      tap((AttachedPolicies = []) => {
        logger.debug(
          `destroy iam user AttachedPolicies: ${AttachedPolicies.length}`
        );
      }),
      forEach((policy) => {
        iam()
          .detachUserPolicy({
            PolicyArn: policy.PolicyArn,
            UserName: id,
          })
          .promise();
      }),
      () => iam().listUserPolicies({ UserName: id, MaxItems: 1e3 }).promise(),
      get("PolicyNames"),
      tap((PolicyNames = []) => {
        logger.debug(`destroy iam user PolicyNames: ${PolicyNames.length}`);
      }),
      forEach((policyName) => {
        iam()
          .deleteUserPolicy({
            PolicyName: policyName,
            UserName: id,
          })
          .promise();
      }),
      () =>
        iam()
          .deleteUser({
            UserName: id,
          })
          .promise(),
      tap(() =>
        retryCall({
          name: `iam user isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam user done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ UserName: name, Path: "/" })(properties);

  return {
    type: "IamUser",
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
