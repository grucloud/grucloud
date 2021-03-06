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
  pick,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  find,
  includes,
} = require("rubico/x");
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
  removeRoleFromInstanceProfile,
} = require("../AwsCommon");
const { mapPoolSize, getByNameCore } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamRole = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  const iam = IAMNew(config);

  const findName = get("live.RoleName");
  const findId = get("live.Arn");

  const findDependencies = ({ live, lives }) => [
    {
      type: "Policy",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
    {
      type: "OpenIDConnectProvider",
      ids: pipe([
        () => live,
        get("AssumeRolePolicyDocument.Statement"),
        map(
          pipe([
            get("Principal.Federated"),
            tap((id) => {
              assert(true);
            }),
            (id) =>
              lives.getById({
                type: "IamOpenIDConnectProvider",
                providerName,
                id,
              }),
            tap((id) => {
              assert(true);
            }),
            get("id"),
          ])
        ),
        tap((id) => {
          assert(true);
        }),
        filter(not(isEmpty)),
        tap((ids) => {
          logger.debug(`IamOpenIDConnectProvider ${ids}`);
        }),
      ])(),
    },
  ];

  const listAttachedRolePolicies = pipe([
    ({ RoleName }) =>
      iam().listAttachedRolePolicies({
        RoleName,
        MaxItems: 1e3,
      }),
    get("AttachedPolicies"),
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
              map(
                pick([
                  "InstanceProfileName",
                  "InstanceProfileId",
                  "Arn",
                  "Path",
                ])
              ),
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

  const getByName = getByNameCore({ getList, findName });

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
            assert(findNameInTags({ live: { Tags } }), "no tags");
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
      forEach(
        tryCatch(({ InstanceProfileName }) =>
          removeRoleFromInstanceProfile({ iam })({
            RoleName,
            InstanceProfileName,
          })
        )
      ),
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

  const cannotBeDeleted = pipe([
    get("live.Path"),
    includes("/aws-service-role"),
  ]);
  return {
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
