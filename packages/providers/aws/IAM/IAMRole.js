const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  filter,
  get,
  fork,
  not,
  assign,
  pick,
  omit,
  and,
  flatMap,
  any,
  or,
  eq,
} = require("rubico");
const {
  callProp,
  identity,
  flatten,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  includes,
  keys,
  first,
  append,
  when,
  filterOut,
} = require("rubico/x");
const querystring = require("querystring");
const logger = require("@grucloud/core/logger")({ prefix: "IamRole" });
const { buildTags, removeRoleFromInstanceProfile } = require("../AwsCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  tagResourceIam,
  untagResourceIam,
  findInStatement,
  sortPolicies,
  ignoreErrorCodes,
  sortStatements,
  dependenciesFromPolicies,
} = require("./IAMCommon");

const findName = () =>
  pipe([
    get("RoleName"),
    tap((RoleName) => {
      assert(RoleName);
    }),
  ]);

const findId = () =>
  pipe([
    get("Arn"),
    tap((Arn) => {
      assert(Arn);
    }),
  ]);

const pickId = pipe([
  pick(["RoleName"]),
  tap(({ RoleName }) => {
    assert(RoleName);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagRole-property
const tagResource = tagResourceIam({ field: "RoleName", method: "tagRole" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagRole-property
const untagResource = untagResourceIam({
  field: "RoleName",
  method: "untagRole",
});

const cannotBeDeleted = () =>
  pipe([
    or([
      // Do not mess with CloudFormation/CDK roles.
      pipe([
        get("RoleName"),
        or([
          includes("cdk-"),
          //callProp("startsWith", "AWS"),
          callProp("startsWith", "stacksets-exec-"),
          eq(identity, "OrganizationAccountAccessRole"),
        ]),
      ]),
      //Path
      pipe([
        get("Path"),
        or([
          //
          includes("/aws-service-role"),
          includes("/aws-reserved/"),
        ]),
      ]),
    ]),
  ]);

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      or([
        cannotBeDeleted({ lives, config }),
        pipe([
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
        ]),
      ]),
    ])();

const findDependencyRole =
  () =>
  ({ type, group, pathLive }) => ({
    type,
    group,
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
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
        flatMap(findInStatement({ type, group, lives, config, pathLive })),
        filter(not(isEmpty)),
        tap.if(not(isEmpty), (id) => {
          assert(id);
        }),
      ]),
  });

exports.findDependenciesRole = () =>
  pipe([() => dependenciesFromPolicies, map(findDependencyRole())])();

//TODO retry listAttachedRolePolicies NoSuchEntity
const listAttachedRolePolicies = ({ endpoint }) =>
  pipe([
    tap(({ RoleName }) => {
      assert(RoleName);
      //logger.debug(`listAttachedRolePolicies: ${RoleName}`);
    }),
    ({ RoleName }) => ({
      RoleName,
      MaxItems: 1e3,
    }),
    endpoint().listAttachedRolePolicies,
    get("AttachedPolicies"),
    sortPolicies,
    tap((policies) => {
      //logger.debug(`listAttachedRolePolicies: ${tos(policies)}`);
    }),
  ]);

const listInlinePolicies =
  ({ endpoint }) =>
  ({ RoleName }) =>
    pipe([
      () => ({ RoleName, MaxItems: 1e3 }),
      endpoint().listRolePolicies,
      get("PolicyNames", []),
      map(
        pipe([
          //TODO retry NoSuchEntity
          (PolicyName) => ({ RoleName, PolicyName }),
          endpoint().getRolePolicy,
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

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      AssumeRolePolicyDocument: pipe([
        get("AssumeRolePolicyDocument"),
        querystring.unescape,
        JSON.parse,
        sortStatements,
      ]),
      Policies: listInlinePolicies({ endpoint }),
      AttachedPolicies: listAttachedRolePolicies({ endpoint }),
      InstanceProfiles: pipe([
        ({ RoleName }) => ({
          RoleName,
          MaxItems: 1e3,
        }),
        endpoint().listInstanceProfilesForRole,
        get("InstanceProfiles"),
        map(pick(["InstanceProfileName", "InstanceProfileId", "Arn", "Path"])),
      ]),
      Tags: pipe([pick(["RoleName"]), endpoint().listRoleTags, get("Tags")]),
    }),
    omitIfEmpty([
      "Description",
      "Policies",
      "AttachedPolicies",
      "InstanceProfiles",
    ]),
  ]);

const attachRolePolicies = ({ endpoint, name }) =>
  map((policy) =>
    endpoint().attachRolePolicy({
      PolicyArn: policy.live.Arn,
      RoleName: name,
    })
  );

const attachRoleAttachedPolicies = ({ endpoint, name }) =>
  map(({ PolicyArn }) =>
    endpoint().attachRolePolicy({
      PolicyArn,
      RoleName: name,
    })
  );

const updateAssumeRolePolicyDocument = ({ endpoint, live }) =>
  pipe([
    tap((payload) => {
      assert(payload);
      assert(endpoint);
      assert(live);
    }),
    get("AssumeRolePolicyDocument"),
    tap((AssumeRolePolicyDocument) => {
      assert(AssumeRolePolicyDocument);
    }),
    JSON.stringify,
    (PolicyDocument) => ({ PolicyDocument }),
    defaultsDeep(pickId(live)),
    endpoint().updateAssumeRolePolicy,
  ]);

const updateRole = ({ endpoint, live }) =>
  pipe([
    tap((payload) => {
      assert(payload);
      assert(endpoint);
      assert(live);
    }),
    pick(["Description", "MaxSessionDuration"]),
    defaultsDeep(pickId(live)),
    endpoint().updateRole,
  ]);

const addAttachedPolicies = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    pick(["PolicyArn"]),
    defaultsDeep(pickId(live)),
    endpoint().attachRolePolicy,
  ]);

const removeAttachedPolicies = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live);
    }),
    pick(["PolicyArn"]),
    defaultsDeep(pickId(live)),
    endpoint().detachRolePolicy,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMRole = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listRoles-property
  const getList = client.getList({
    method: "listRoles",
    getParam: "Roles",
    filterResource: pipe([
      and([
        ({ CreateDate }) => new Date(CreateDate) > new Date("2021-09-11"),
        pipe([
          get("RoleName"),
          or([
            includes("AWSServiceRoleForLexV2Bots"),
            not(includes("AWSServiceRole")),
          ]),
        ]),
      ]),
    ]),
    ignoreErrorCodes: ["NoSuchEntityException"],
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = () =>
    pipe([({ RoleName }) => ({ name: RoleName }), getByName]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property

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
    postCreate: ({
      endpoint,
      name,
      payload,
      resolvedDependencies: { policies },
    }) =>
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
              endpoint().putRolePolicy,
            ])
          ),
        ]),
        pipe([() => policies, attachRolePolicies({ endpoint, name })]),
        pipe([
          () => payload,
          get("AttachedPolicies", []),
          attachRoleAttachedPolicies({ endpoint, name }),
        ]),
      ]),
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateAssumeRolePolicy-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateRole-property

  const update = (params) =>
    pipe([
      tap(() => {
        assert(params);
      }),
      () => ({ ...params, endpoint: iam }),
      updateResourceObject({
        path: "AssumeRolePolicyDocument",
        onDeleted: updateAssumeRolePolicyDocument,
        onAdded: updateAssumeRolePolicyDocument,
        onUpdated: updateAssumeRolePolicyDocument,
      }),
      () => ({ ...params, endpoint: iam }),
      updateResourceObject({
        path: "Description",
        onDeleted: updateRole,
        onAdded: updateRole,
        onUpdated: updateRole,
      }),
      () => params,
      updateResourceArray({
        endpoint: iam,
        arrayPath: "AttachedPolicies",
        onAdd: addAttachedPolicies,
        onRemove: removeAttachedPolicies,
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteRole-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          () => live,
          ({ RoleName }) =>
            pipe([
              () => ({ RoleName, MaxItems: 1e3 }),
              endpoint().listInstanceProfilesForRole,
              get("InstanceProfiles"),
              forEach(
                tryCatch(
                  pipe([
                    ({ InstanceProfileName }) => ({
                      RoleName,
                      InstanceProfileName,
                    }),
                    removeRoleFromInstanceProfile({ endpoint }),
                  ]),
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
              () => ({ RoleName, MaxItems: 1e3 }),
              endpoint().listAttachedRolePolicies,
              get("AttachedPolicies"),
              forEach(({ PolicyArn }) => {
                endpoint().detachRolePolicy({
                  PolicyArn,
                  RoleName,
                });
              }),
              () => ({ RoleName, MaxItems: 1e3 }),
              endpoint().listRolePolicies,
              get("PolicyNames"),
              forEach((PolicyName) => {
                endpoint().deleteRolePolicy({
                  PolicyName,
                  RoleName,
                });
              }),
            ])(),
        ])()
      ),
    method: "deleteRole",
    ignoreErrorCodes,
    shouldRetryOnExceptionCodes: ["DeleteConflictException"],
    getById,
    config,
  });

  const configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    dependencies: { policies },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      when(
        () => policies,
        assign({
          AttachedPolicies: ({ AttachedPolicies = [] }) =>
            pipe([
              () => policies,
              pluck("live"),
              filterOut(isEmpty),
              map(({ Arn, PolicyName }) => ({ PolicyArn: Arn, PolicyName })),
              (policies) => [...policies, ...AttachedPolicies],
            ])(),
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    getByName,
    getById,
    cannotBeDeleted,
    findName,
    create,
    destroy,
    update,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ endpoint: iam }),
    untagResource: untagResource({ endpoint: iam }),
  };
};
