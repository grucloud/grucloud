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
  not,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, find } = require("rubico/x");
const moment = require("moment");
const querystring = require("querystring");
const logger = require("@grucloud/core/logger")({ prefix: "IamRole" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNameInTags,
  findNamespaceInTags,
  shouldRetryOnExceptionDelete,
  shouldRetryOnException,
} = require("../AwsCommon");
const { mapPoolSize, getByNameCore } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamRole = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = get("RoleName");
  const findId = get("Arn");

  const findDependencies = ({ live }) => [
    //TODO
    //{ type: "IamPolicy", ids: live.AttachedPolicies },
    { type: "IamPolicyReadOnly", ids: live.AttachedPolicies },
  ];

  const listAttachedRolePolicies = pipe([
    ({ RoleName }) =>
      iam().listAttachedRolePolicies({
        RoleName,
        MaxItems: 1e3,
      }),
    get("AttachedPolicies"),
    pluck("PolicyArn"),
    tap((policies) => {
      logger.debug(`getList listAttachedRolePolicies: ${tos(policies)}`);
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listRoles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList role ${params}`);
      }),
      () => iam().listRoles(params),
      get("Roles"),
      filter((role) => moment(role.CreateDate).isAfter("2020-09-11")),
      filter((role) => !role.RoleName.includes("AWSServiceRole")),
      tap((roles) => {
        assert(roles);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          assign({
            AssumeRolePolicyDocument: pipe([
              ({ AssumeRolePolicyDocument }) =>
                querystring.unescape(AssumeRolePolicyDocument),
              JSON.parse,
            ]),
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
            AttachedPolicies: listAttachedRolePolicies,
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
              tap(() => {
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

  const isDownByName = ({ name }) =>
    pipe([() => getByName({ name }), isEmpty])();
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property

  const create = async ({
    name,
    namespace,
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
              Tags: buildTags({
                name,
                config,
                namespace,
                UserTags: payload.Tags,
              }),
            }),
          () => iam().listRoleTags({ RoleName: name }),
          get("Tags"),
          (Tags) => {
            assert(findNameInTags({ Tags }), "no tags");
          },
        ])
      ),
      //TODO check error
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
          )(policies),
        () =>
          listAttachedRolePolicies({
            RoleName: name,
          }),
        tap.if(
          (attachedRolePolicies) =>
            attachedRolePolicies.length != policies.length,
          () => {
            throw Error(`attachRolePolicy fails`);
          }
        )
      ),
      tap((Role) => {
        logger.info(`created role ${tos({ name, Role })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property
  const destroy = async ({ name: RoleName }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam role ${JSON.stringify({ RoleName })}`);
      }),
      () => iam().listInstanceProfilesForRole({ RoleName, MaxItems: 1e3 }),
      get("InstanceProfiles"),
      forEach((instanceProfile) => {
        iam().removeRoleFromInstanceProfile({
          InstanceProfileName: instanceProfile.InstanceProfileName,
          RoleName,
        });
      }),
      () => iam().listAttachedRolePolicies({ RoleName, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      forEach((policy) => {
        iam().detachRolePolicy({
          PolicyArn: policy.PolicyArn,
          RoleName,
        });
      }),
      () => iam().listRolePolicies({ RoleName, MaxItems: 1e3 }),
      get("PolicyNames"),
      forEach((policyName) => {
        iam().deleteRolePolicy({
          PolicyName: policyName,
          RoleName,
        });
      }),
      () =>
        iam().deleteRole({
          RoleName,
        }),
      tap(() =>
        retryCall({
          name: `isDownById iam role: ${RoleName}`,
          fn: () => isDownByName({ name: RoleName }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam role done, ${RoleName}`);
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
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    findId,
    getByName,
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
