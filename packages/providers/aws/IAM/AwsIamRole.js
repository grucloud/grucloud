const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  filter,
  get,
  fork,
  switchCase,
  not,
  assign,
  pick,
  omit,
  and,
  flatMap,
  any,
  or,
} = require("rubico");
const {
  callProp,
  when,
  flatten,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  includes,
  keys,
  first,
  append,
} = require("rubico/x");
const moment = require("moment");
const querystring = require("querystring");
const logger = require("@grucloud/core/logger")({ prefix: "IamRole" });
const { tos } = require("@grucloud/core/tos");
const {
  buildTags,
  findNamespaceInTags,
  removeRoleFromInstanceProfile,
} = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  tagResourceIam,
  untagResourceIam,
  dependenciesPoliciesKind,
  findInStatement,
  sortPolicies,
  ignoreErrorCodes,
} = require("./AwsIamCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagRole-property
const tagResource = tagResourceIam({ field: "RoleName", method: "tagRole" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagRole-property
const untagResource = untagResourceIam({
  field: "RoleName",
  method: "untagRole",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamRole = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);
  const { providerName } = config;

  const findName = get("live.RoleName");
  const findId = get("live.Arn");
  const pickId = pick(["RoleName"]);

  const managedByOther = ({ live, lives }) =>
    pipe([
      () =>
        lives.getByType({
          type: "Stack",
          group: "CloudFormation",
          providerName: config.providerName,
        }),
      any(
        pipe([
          get("name"),
          append("-AWS"),
          (stackName) => live.RoleName.includes(stackName),
        ])
      ),
    ])();

  const findDependencyRoleCommon = ({ type, group, live, lives, config }) => ({
    type,
    group,
    ids: pipe([
      () => live,
      fork({
        statementInPolicies: pipe([
          get("Policies"),
          pluck("PolicyDocument"),
          pluck("Statement"),
          flatten,
        ]),
        statementInAssumeRolePolicyDocument: pipe([
          get("AssumeRolePolicyDocument"),
          get("Statement"),
        ]),
      }),
      ({
        statementInPolicies = [],
        statementInAssumeRolePolicyDocument = [],
      }) => [...statementInPolicies, ...statementInAssumeRolePolicyDocument],
      flatMap(findInStatement({ type, group, lives, config })),
      filter(not(isEmpty)),
      tap.if(not(isEmpty), (id) => {
        assert(id);
      }),
    ])(),
  });

  const findDependenciesRoleCommon = ({ live, lives, config }) =>
    pipe([
      () => dependenciesPoliciesKind,
      tap((params) => {
        assert(true);
      }),
      map(({ type, group }) =>
        findDependencyRoleCommon({ type, group, live, lives, config })
      ),
    ])();

  const findDependencies = ({ live, lives }) => [
    {
      type: "Policy",
      group: "IAM",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
    {
      type: "OpenIDConnectProvider",
      group: "IAM",
      ids: pipe([
        () => live,
        get("AssumeRolePolicyDocument.Statement"),
        pluck("Principal.Federated"),
        filter(not(isEmpty)),
        (oidps) =>
          pipe([
            () =>
              lives.getByType({
                type: "OpenIDConnectProvider",
                group: "IAM",
                providerName,
              }),
            filter((connectProvider) =>
              pipe([() => oidps, includes(connectProvider.id)])()
            ),
            pluck("id"),
          ])(),
      ])(),
    },
    ...findDependenciesRoleCommon({ live, lives, config }),
  ];

  //TODO retry listAttachedRolePolicies NoSuchEntity
  const listAttachedRolePolicies = pipe([
    ({ RoleName }) =>
      iam().listAttachedRolePolicies({
        RoleName,
        MaxItems: 1e3,
      }),
    get("AttachedPolicies"),
    sortPolicies,
    tap((policies) => {
      logger.debug(`getList listAttachedRolePolicies: ${tos(policies)}`);
    }),
  ]);
  const listInlinePolicies = ({ RoleName }) =>
    pipe([
      () => ({ RoleName, MaxItems: 1e3 }),
      iam().listRolePolicies,
      get("PolicyNames", []),
      map(
        pipe([
          //TODO retry NoSuchEntity
          (PolicyName) => ({ RoleName, PolicyName }),
          iam().getRolePolicy,
          pick(["PolicyDocument", "PolicyName"]),
          assign({
            PolicyDocument: pipe([
              get("PolicyDocument"),
              querystring.decode,
              keys,
              first,
              JSON.parse,
            ]),
          }),
        ])
      ),
    ])();

  const sortStatement = pipe([
    assign({
      Principal: pipe([
        get("Principal"),
        assign({
          Service: pipe([
            get("Service"),
            when(
              Array.isArray,
              pipe([callProp("sort", (a, b) => a.localeCompare(b))])
            ),
          ]),
        }),
      ]),
    }),
  ]);

  const sortStatements = pipe([
    assign({
      Statement: pipe([
        get("Statement"),
        switchCase([Array.isArray, map(sortStatement), sortStatement]),
      ]),
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listRoles-property
  const getList = client.getList({
    method: "listRoles",
    getParam: "Roles",
    filterResource: pipe([
      tap((params) => {
        assert(true);
      }),
      and([
        ({ CreateDate }) => moment(CreateDate).isAfter("2021-09-11"),
        ({ RoleName }) => !RoleName.includes("AWSServiceRole"),
      ]),
      tap((params) => {
        assert(true);
      }),
    ]),
    decorate: () =>
      pipe([
        assign({
          AssumeRolePolicyDocument: pipe([
            get("AssumeRolePolicyDocument"),
            querystring.unescape,
            JSON.parse,
            sortStatements,
          ]),
          Policies: listInlinePolicies,
          AttachedPolicies: listAttachedRolePolicies,
          InstanceProfiles: pipe([
            ({ RoleName }) => ({
              RoleName,
              MaxItems: 1e3,
            }),
            iam().listInstanceProfilesForRole,
            get("InstanceProfiles"),
            map(
              pick(["InstanceProfileName", "InstanceProfileId", "Arn", "Path"])
            ),
          ]),
          Tags: pipe([pick(["RoleName"]), iam().listRoleTags, get("Tags")]),
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = () =>
    pipe([({ RoleName }) => ({ name: RoleName }), getByName]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property
  const attachRolePolicies = ({ name }) =>
    map((policy) =>
      iam().attachRolePolicy({
        PolicyArn: policy.live.Arn,
        RoleName: name,
      })
    );

  const attachRoleAttachedPolicies = ({ name }) =>
    map(({ PolicyArn }) =>
      iam().attachRolePolicy({
        PolicyArn,
        RoleName: name,
      })
    );

  //TODO getById
  const create = client.create({
    method: "createRole",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    filterPayload: pipe([
      omit(["Policies", "AttachedPolicies"]),
      assign({
        AssumeRolePolicyDocument: pipe([
          get("AssumeRolePolicyDocument"),
          JSON.stringify,
        ]),
      }),
    ]),
    postCreate: ({ name, payload, resolvedDependencies: { policies } }) =>
      pipe([
        pipe([
          () => payload,
          get("Policies", []),
          map(
            pipe([
              pick(["PolicyName", "PolicyDocument"]),
              assign({
                PolicyDocument: pipe([get("PolicyDocument"), JSON.stringify]),
              }),
              defaultsDeep({ RoleName: name }),
              iam().putRolePolicy,
            ])
          ),
        ]),
        pipe([() => policies, attachRolePolicies({ name })]),
        pipe([
          () => payload,
          get("AttachedPolicies", []),
          attachRoleAttachedPolicies({ name }),
        ]),
      ]),
    config,
  });

  // TODO error: Cannot delete entity, must delete policies first.
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live }) =>
      pipe([
        () => live,
        ({ RoleName }) =>
          pipe([
            () =>
              iam().listInstanceProfilesForRole({ RoleName, MaxItems: 1e3 }),
            get("InstanceProfiles"),
            forEach(
              tryCatch(
                ({ InstanceProfileName }) =>
                  removeRoleFromInstanceProfile({ iam })({
                    RoleName,
                    InstanceProfileName,
                  }),
                (error, { InstanceProfileName }) =>
                  pipe([
                    tap(() => {
                      logger.error(
                        `error removeRoleFromInstanceProfile ${RoleName}, ${error}`
                      );
                    }),
                    () => ({ error, RoleName, InstanceProfileName }),
                  ])()
              )
            ),
            () => iam().listAttachedRolePolicies({ RoleName, MaxItems: 1e3 }),
            get("AttachedPolicies"),
            forEach(({ PolicyArn }) => {
              iam().detachRolePolicy({
                PolicyArn,
                RoleName,
              });
            }),
            () => iam().listRolePolicies({ RoleName, MaxItems: 1e3 }),
            get("PolicyNames"),
            forEach((PolicyName) => {
              iam().deleteRolePolicy({
                PolicyName,
                RoleName,
              });
            }),
          ])(),
      ])(),
    method: "deleteRole",
    ignoreErrorCodes,
    shouldRetryOnExceptionCodes: ["DeleteConflictException"],
    getById,
    config,
  });

  const openIdConnectProviderProperties = ({ openIdConnectProvider }) =>
    pipe([
      () => openIdConnectProvider,
      switchCase([
        isEmpty,
        () => ({}),
        pipe([
          () => ({
            AssumeRolePolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Principal: {
                    Federated: getField(openIdConnectProvider, "Arn"),
                  },
                  Action: "sts:AssumeRoleWithWebIdentity",
                  Condition: {
                    StringEquals: {
                      [`${getField(openIdConnectProvider, "Url")}:aud`]:
                        "sts.amazonaws.com",
                    },
                  },
                },
              ],
            },
          }),
        ]),
      ]),
    ])();

  const configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    dependencies: { openIdConnectProvider },
  }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => otherProps,
      defaultsDeep(openIdConnectProviderProperties({ openIdConnectProvider })),
      defaultsDeep({
        //TODO remove
        RoleName: name,
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])();

  const cannotBeDeleted = pipe([
    get("live.Path"),
    or([includes("/aws-service-role"), includes("/aws-reserved/")]),
  ]);

  return {
    spec,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    findId,
    getByName,
    getById,
    cannotBeDeleted,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ iam }),
    untagResource: untagResource({ iam }),
  };
};
