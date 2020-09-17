const assert = require("assert");
const AWS = require("aws-sdk");
const { map, pipe, tap, tryCatch, filter, get, switchCase } = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");
const moment = require("moment");

const logger = require("../../../logger")({ prefix: "IamRole" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { buildTags, findNameInTags } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamRole = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = new AWS.IAM();

  const findName = (item) => findNameInTags(item);

  const findId = (item) => {
    assert(item);
    const id = item.RoleName;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listRoles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${params}`);
      }),
      () => iam.listRoles(params).promise(),
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
                iam
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
                iam
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
                iam
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
              await iam.listRoleTags({ RoleName: role.RoleName }).promise()
            ).Tags,
          }),
          tap((role) => {
            logger.debug(role);
          }),
        ])
      ),
      (roles) => ({
        total: roles.length,
        items: roles,
      }),
      tap((roles) => {
        logger.debug(`getList results: ${tos(roles)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam.getRole({ RoleName: id }).promise(),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property
  const create = async ({ name, payload = {}, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create role ${tos({ name, payload })}`);

    const { Role } = await iam
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
    await iam.tagRole(tagsParam).promise();
    const { Tags } = await iam.listRoleTags({ RoleName: name }).promise();
    assert(findNameInTags({ Tags }), "no tags");
    return Role;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        iam
          .listInstanceProfilesForRole({ RoleName: id, MaxItems: 1e3 })
          .promise(),
      get("InstanceProfiles"),
      forEach(async (instanceProfile) => {
        await iam
          .removeRoleFromInstanceProfile({
            InstanceProfileName: instanceProfile.InstanceProfileName,
            RoleName: id,
          })
          .promise();
      }),
      () =>
        iam.listAttachedRolePolicies({ RoleName: id, MaxItems: 1e3 }).promise(),
      get("AttachedPolicies"),
      forEach(async (policy) => {
        await iam
          .detachRolePolicy({
            PolicyArn: policy.PolicyArn,
            RoleName: id,
          })
          .promise();
      }),
      () => iam.listRolePolicies({ RoleName: id, MaxItems: 1e3 }).promise(),
      get("PolicyNames"),
      forEach(async (policyName) => {
        await iam
          .deleteRolePolicy({
            PolicyName: policyName,
            RoleName: id,
          })
          .promise();
      }),
      () =>
        iam
          .deleteRole({
            RoleName: id,
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
    return defaultsDeep({ RoleName: name, Path: "/" })(properties);
  };

  return {
    type: "IamRole",
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
