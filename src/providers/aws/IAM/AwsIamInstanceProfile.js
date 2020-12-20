const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamInstanceProfile" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  IAMNew,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = get("InstanceProfileName");
  const findId = findName;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listInstanceProfiles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList`);
      }),
      () => iam().listInstanceProfiles(params),
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
              Tags: (await iam().listRoleTags({ RoleName: role.RoleName }))
                .Tags,
            }))(instanceProfile.Roles),
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
          () => iam().getInstanceProfile({ InstanceProfileName: id }),
          tap((obj) => {
            logger.debug(`getById ${obj}`);
          }),
          get("InstanceProfile"),
        ])(),
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
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create instance profile: ${tos({ name, payload })}`);

    const createParams = defaultsDeep({})(payload);

    const { InstanceProfile } = await iam().createInstanceProfile(createParams);
    logger.debug(`create result ${tos(InstanceProfile)}`);

    const { iamRoles } = dependencies;
    assert(iamRoles, "missing dependency iamRoles");
    assert(Array.isArray(iamRoles), "iamRoles must be an array");

    await forEach((iamRole) =>
      iam().addRoleToInstanceProfile({
        InstanceProfileName: name,
        RoleName: iamRole.name,
      })
    )(iamRoles);

    const instanceUp = await retryCall({
      name: `create instance profile, getById: ${name}`,
      fn: () => getById({ id: name }),
      isExpectedResult: (result) => {
        if (result && !isEmpty(result.Roles)) {
          return true;
        }
      },
      config: { retryDelay: 2e3 },
    });
    return instanceUp;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteInstanceProfile-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam instance profile ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => getById({ id }),
      tap((instanceProfile) =>
        forEach((role) =>
          iam().removeRoleFromInstanceProfile({
            InstanceProfileName: id,
            RoleName: role.RoleName,
          })
        )(instanceProfile.Roles)
      ),
      tap(() =>
        iam().deleteInstanceProfile({
          InstanceProfileName: id,
        })
      ),
      tap(() =>
        retryCall({
          name: `iam instance profile isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam instance profile done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ InstanceProfileName: name })(properties);

  return {
    type: "IamInstanceProfile",
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

exports.isOurMinionInstanceProfile = ({ resource, config }) => {
  const { createdByProviderKey, providerName } = config;

  assert(resource);
  const { Roles = [] } = resource;
  if (isEmpty(Roles)) {
    return false;
  }

  let minion = false;
  if (
    Roles[0].Tags.find(
      (tag) => tag.Key === createdByProviderKey && tag.Value === providerName
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
