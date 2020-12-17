const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, filter, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");
const moment = require("moment");

const logger = require("../../../logger")({ prefix: "IamRole" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  IAMNew,
  buildTags,
  findNameInTags,
  shouldRetryOnExceptionDelete,
  shouldRetryOnException,
} = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamRole = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = get("RoleName");
  const findId = findName;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listRoles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList role ${params}`);
      }),
      () => iam().listRoles(params).promise(),
      tap((roles) => {
        logger.debug(`getList: ${tos(roles)}`);
      }),
      get("Roles"),
      filter((role) => moment(role.CreateDate).isAfter("2020-09-11")),
      map.pool(
        20,
        pipe([
          tap((role) => {
            logger.debug(`getList role: ${tos(role)}`);
          }),
          async (role) => ({
            ...role,
            Policies: await pipe([
              () =>
                iam()
                  .listRolePolicies({
                    RoleName: role.RoleName,
                    MaxItems: 1e3,
                  })
                  .promise(),
              tap((policies) => {
                logger.debug(`getList listRolePolicies: ${tos(policies)}`);
              }),
              get("PolicyNames"),
            ])(),
            AttachedPolicies: await pipe([
              () =>
                iam()
                  .listAttachedRolePolicies({
                    RoleName: role.RoleName,
                    MaxItems: 1e3,
                  })
                  .promise(),
              get("AttachedPolicies"),
              pluck("PolicyName"),
              tap((policies) => {
                logger.debug(
                  `getList listAttachedRolePolicies: ${tos(policies)}`
                );
              }),
            ])(),
            InstanceProfiles: await pipe([
              () =>
                iam()
                  .listInstanceProfilesForRole({
                    RoleName: role.RoleName,
                    MaxItems: 1e3,
                  })
                  .promise(),
              get("InstanceProfiles"),
              tap((instanceProfiles) => {
                logger.debug(
                  `getList listInstanceProfilesForRole: ${tos(
                    instanceProfiles
                  )}`
                );
              }),
              pluck("InstanceProfileName"),
            ])(),
            Tags: (
              await iam().listRoleTags({ RoleName: role.RoleName }).promise()
            ).Tags,
          }),
        ])
      ),
      (roles) => ({
        total: roles.length,
        items: roles,
      }),
      tap((roles) => {
        logger.info(`getList #roles: ${roles.length}`);
        logger.debug(`getList results: ${tos(roles)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById role ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getRole({ RoleName: id }).promise(),
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
      logger.debug(`getById role result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.info(`create role ${tos({ name, payload })}`);

    const { Role } = await iam()
      .createRole({
        ...payload,
        AssumeRolePolicyDocument: JSON.stringify(
          payload.AssumeRolePolicyDocument
        ),
      })
      .promise();
    logger.debug(`create result ${tos(Role)}`);

    const tagsParam = {
      RoleName: name,
      Tags: defaultsDeep(buildTags({ name, config }))(payload.Tags || []),
    };
    await iam().tagRole(tagsParam).promise();
    const { Tags } = await iam().listRoleTags({ RoleName: name }).promise();
    assert(findNameInTags({ Tags }), "no tags");
    return Role;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam role ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        iam()
          .listInstanceProfilesForRole({ RoleName: id, MaxItems: 1e3 })
          .promise(),
      get("InstanceProfiles"),
      forEach((instanceProfile) => {
        iam()
          .removeRoleFromInstanceProfile({
            InstanceProfileName: instanceProfile.InstanceProfileName,
            RoleName: id,
          })
          .promise();
      }),
      () =>
        iam()
          .listAttachedRolePolicies({ RoleName: id, MaxItems: 1e3 })
          .promise(),
      get("AttachedPolicies"),
      forEach((policy) => {
        iam()
          .detachRolePolicy({
            PolicyArn: policy.PolicyArn,
            RoleName: id,
          })
          .promise();
      }),
      () => iam().listRolePolicies({ RoleName: id, MaxItems: 1e3 }).promise(),
      get("PolicyNames"),
      forEach((policyName) => {
        iam()
          .deleteRolePolicy({
            PolicyName: policyName,
            RoleName: id,
          })
          .promise();
      }),
      () =>
        iam()
          .deleteRole({
            RoleName: id,
          })
          .promise(),
      tap(() =>
        retryCall({
          name: `isDownById iam role: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam role done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({ RoleName: name, Path: "/" })(properties);

  const cannotBeDeleted = (item) => {
    return item.resource.Path.includes("/aws-service-role");
  };

  return {
    type: "IamRole",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};
