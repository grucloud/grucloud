const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get } = require("rubico");
const { defaultsDeep, isEmpty, forEach } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamInstanceProfile" });
const { retryExpectOk, retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = new AWS.IAM();

  const findName = (item) => {
    assert(item.InstanceProfileName);
    return item.InstanceProfileName;
  };

  const findId = (item) => {
    assert(item);
    const id = item.InstanceProfileName;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listInstanceProfiles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList`);
      }),
      () => iam.listInstanceProfiles(params).promise(),
      tap((instanceProfiles) => {
        logger.debug(`getList: ${tos(instanceProfiles)}`);
      }),
      get("InstanceProfiles"),
      map.pool(
        20,
        pipe([
          tap((instanceProfile) => {
            logger.debug(`getList instanceProfile: ${tos(instanceProfile)}`);
          }),
          async (instanceProfile) => ({
            ...instanceProfile,
            Roles: await map(async (role) => ({
              ...role,
              Tags: (
                await iam.listRoleTags({ RoleName: role.RoleName }).promise()
              ).Tags,
            }))(instanceProfile.Roles),
          }),
          tap((role) => {
            logger.debug(role);
          }),
        ])
      ),
      (instanceProfiles) => ({
        total: instanceProfiles.length,
        items: instanceProfiles,
      }),
      tap((instanceProfiles) => {
        logger.debug(`getList results: ${tos(instanceProfiles)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) =>
        pipe([
          () => iam.getInstanceProfile({ InstanceProfileName: id }).promise(),
          tap((obj) => {
            logger.debug(`getById ${obj}`);
          }),
          get("InstanceProfile"),
        ])(),
      (error) => {
        logger.debug(`getById error: ${tos(error)}`);
        if (error.code !== "NoSuchEntity") {
          throw error;
        }
      }
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);

    const createParams = defaultsDeep({})(payload);

    const { InstanceProfile } = await iam
      .createInstanceProfile(createParams)
      .promise();

    logger.debug(`create result ${tos(InstanceProfile)}`);

    const { iamRoles } = dependencies;
    assert(iamRoles, "missing dependency iamRoles");
    assert(Array.isArray(iamRoles), "iamRoles must be an array");

    await forEach((iamRole) =>
      iam
        .addRoleToInstanceProfile({
          InstanceProfileName: name,
          RoleName: iamRole.name,
        })
        .promise()
    )(iamRoles);

    const instanceUp = await retryCall({
      name: `getById: ${name}`,
      fn: () => getById({ id: name }),
      isExpectedResult: (result) => {
        if (result && !isEmpty(result.Roles)) {
          return true;
        }
      },
      shouldRetryOnException: (error) => false,
      retryDelay: 2e3,
    });
    return instanceUp;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteInstanceProfile-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => getById({ id }),
      tap(
        async (instanceProfile) =>
          await forEach((role) =>
            iam
              .removeRoleFromInstanceProfile({
                InstanceProfileName: id,
                RoleName: role.RoleName,
              })
              .promise()
          )(instanceProfile.Roles)
      ),
      () =>
        iam
          .deleteInstanceProfile({
            InstanceProfileName: id,
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
    return defaultsDeep({ InstanceProfileName: name })(properties);
  };

  return {
    type: "IamInstanceProfile",
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

exports.isOurMinionInstanceProfile = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  const { Roles = [] } = resource;
  if (isEmpty(Roles)) {
    return false;
  }

  let minion = false;
  if (
    Roles[0].Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  ) {
    minion = true;
  }
  logger.debug(
    `isOurMinion ${tos({
      minion,
      resource,
    })}`
  );
  return minion;
};
