const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  filter,
  get,
  switchCase,
  eq,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, find } = require("rubico/x");
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
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("../../Common");

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
      () => iam().listRoles(params),
      get("Roles"),
      filter((role) => moment(role.CreateDate).isAfter("2020-09-11")),
      tap((roles) => {
        assert(roles);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          assign({
            Policies: pipe([
              ({ RoleName }) =>
                iam().listRolePolicies({
                  RoleName,
                  MaxItems: 1e3,
                }),
              tap((policies) => {
                logger.debug(`getList listRolePolicies: ${tos(policies)}`);
              }),
              get("PolicyNames"),
            ]),
            AttachedPolicies: pipe([
              ({ RoleName }) =>
                iam().listAttachedRolePolicies({
                  RoleName,
                  MaxItems: 1e3,
                }),
              get("AttachedPolicies"),
              pluck("PolicyName"),
              tap((policies) => {
                logger.debug(
                  `getList listAttachedRolePolicies: ${tos(policies)}`
                );
              }),
            ]),
            InstanceProfiles: pipe([
              ({ RoleName }) =>
                iam().listInstanceProfilesForRole({
                  RoleName,
                  MaxItems: 1e3,
                }),
              get("InstanceProfiles"),
              tap((instanceProfiles) => {
                logger.debug(
                  `getList listInstanceProfilesForRole: ${tos(
                    instanceProfiles
                  )}`
                );
              }),
              pluck("InstanceProfileName"),
            ]),
            Tags: pipe([
              ({ RoleName }) => iam().listRoleTags({ RoleName }),
              get("Tags"),
            ]),
          }),
          (error, role) =>
            pipe([
              tap((role) => {
                logger.error(
                  `getList role error: ${tos({
                    error,
                    role,
                  })}`
                );
              }),
              () => ({ error, role }),
            ])()
        )
      ),
      tap.if(find(get("error")), (roles) => {
        throw roles;
      }),
      tap((roles) => {
        logger.debug(`getList iam role results: ${tos(roles)}`);
      }),
      (roles) => ({
        total: roles.length,
        items: roles,
      }),
      tap(({ total }) => {
        logger.info(`getList #roles: ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById role ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getRole({ RoleName: id }),
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
      logger.debug(`getById role result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property

  const create = async ({
    name,
    payload = {},
    resolvedDependencies: { policies },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create role ${tos({ name, payload })}`);
      }),
      () => ({
        ...payload,
        AssumeRolePolicyDocument: JSON.stringify(
          payload.AssumeRolePolicyDocument
        ),
      }),
      (createParam) => iam().createRole(createParam),
      get("Role"),
      tap(
        pipe([
          () =>
            iam().tagRole({
              RoleName: name,
              Tags: defaultsDeep(buildTags({ name, config }))(
                payload.Tags || []
              ),
            }),
          () => iam().listRoleTags({ RoleName: name }),
          get("Tags"),
          (Tags) => {
            assert(findNameInTags({ Tags }), "no tags");
          },
        ])
      ),
      tap.if(
        () => policies,
        () =>
          map(
            pipe([
              (policy) =>
                iam().attachRolePolicy({
                  PolicyArn: policy.live.Arn,
                  RoleName: name,
                }),
            ])
          )(policies)
      ),
      tap((Role) => {
        logger.info(`created role ${tos({ name, Role })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam role ${JSON.stringify({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => iam().listInstanceProfilesForRole({ RoleName: id, MaxItems: 1e3 }),
      get("InstanceProfiles"),
      forEach((instanceProfile) => {
        iam().removeRoleFromInstanceProfile({
          InstanceProfileName: instanceProfile.InstanceProfileName,
          RoleName: id,
        });
      }),
      () => iam().listAttachedRolePolicies({ RoleName: id, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      forEach((policy) => {
        iam().detachRolePolicy({
          PolicyArn: policy.PolicyArn,
          RoleName: id,
        });
      }),
      () => iam().listRolePolicies({ RoleName: id, MaxItems: 1e3 }),
      get("PolicyNames"),
      forEach((policyName) => {
        iam().deleteRolePolicy({
          PolicyName: policyName,
          RoleName: id,
        });
      }),
      () =>
        iam().deleteRole({
          RoleName: id,
        }),
      tap(() =>
        retryCall({
          name: `isDownById iam role: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam role done, ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = ({ name, properties }) =>
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
