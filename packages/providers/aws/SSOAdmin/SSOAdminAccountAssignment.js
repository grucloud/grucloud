const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  fork,
  flatMap,
  switchCase,
  or,
} = require("rubico");
const {
  defaultsDeep,
  find,
  when,
  prepend,
  identity,
  isEmpty,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const dependencyIdPrincipal =
  ({ type }) =>
  ({ lives, config }) =>
    pipe([
      switchCase([
        eq(get("PrincipalType"), type),
        get("PrincipalId"),
        () => undefined,
      ]),
    ]);

const getPrincipalName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => live,
      switchCase([
        eq(get("PrincipalType"), "USER"),
        pipe([
          get("PrincipalId"),
          (PrincipalId) =>
            pipe([
              () =>
                lives.getByType({
                  type: "User",
                  group: "IdentityStore",
                  providerName: config.providerName,
                }),
              find(eq(get("live.UserId"), PrincipalId)),
              get("name"),
            ])(),
        ]),
        eq(get("PrincipalType"), "GROUP"),
        pipe([
          (PrincipalId) =>
            pipe([
              () =>
                lives.getByType({
                  type: "Group",
                  group: "IdentityStore",
                  providerName: config.providerName,
                }),
              find(eq(get("live.GroupId"), PrincipalId)),
              get("name"),
            ])(),
        ]),
        pipe([get("PrincipalId")]),
      ]),
    ])();

const pickId = pipe([
  tap(({ InstanceArn, PermissionSetArn, PrincipalId, TargetId }) => {
    assert(InstanceArn);
    assert(PermissionSetArn);
    assert(PrincipalId);
    assert(TargetId);
  }),
  pick([
    "InstanceArn",
    "PermissionSetArn",
    "PrincipalId",
    "PrincipalType",
    "TargetId",
    "TargetType",
  ]),
  defaultsDeep({ TargetType: "AWS_ACCOUNT" }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const cannotBeDeleted = ({ lives, live, config }) =>
  pipe([() => live, getPrincipalName({ lives, config }), isEmpty])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html
exports.SSOAdminAccountAssignment = ({ compare }) => ({
  type: "AccountAssignment",
  package: "sso-admin",
  client: "SSOAdmin",
  propertiesDefault: { TargetType: "AWS_ACCOUNT" },
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  omitProperties: [
    "InstanceArn",
    "PermissionSetArn",
    "TargetId",
    "PrincipalId",
    "PrincipalType",
  ],
  inferName: ({
    properties: { PrincipalId },
    dependenciesSpec: { permissionSet, targetAccount, user, group },
  }) =>
    pipe([
      tap((params) => {
        assert(permissionSet);
        assert(targetAccount);
        assert(user || group || PrincipalId);
      }),
      () => `${permissionSet}::${targetAccount}::${user ? user : group}`,
      prepend("assignment::"),
    ])(),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
    permissionSet: {
      type: "PermissionSet",
      group: "SSOAdmin",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("PermissionSetArn"),
          tap((PermissionSetArn) => {
            assert(PermissionSetArn);
          }),
        ]),
    },
    user: {
      type: "User",
      group: "IdentityStore",
      parent: true,
      dependencyId: dependencyIdPrincipal({ type: "USER" }),
    },
    group: {
      type: "Group",
      group: "IdentityStore",
      dependencyId: dependencyIdPrincipal({ type: "GROUP" }),
    },
    targetAccount: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TargetId"),
          tap((TargetId) => {
            assert(TargetId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: ({ live, lives, config }) =>
    pipe([
      () => live,
      fork({
        permissionSetName: pipe([
          get("PermissionSetArn"),
          tap((id) => {
            assert(id);
          }),
          (id) =>
            lives.getById({
              id,
              type: "PermissionSet",
              group: "SSOAdmin",
              providerName: config.providerName,
            }),
          get("name", live.PermissionSetArn),
        ]),
        accountName: pipe([
          get("TargetId"),
          tap((id) => {
            assert(id);
          }),
          (id) =>
            lives.getById({
              id,
              type: "Account",
              group: "Organisations",
              providerName: config.providerName,
            }),
          get("name", live.TargetId),
        ]),
        principalName: pipe([
          getPrincipalName({ lives, config }),
          when(isEmpty, () => live.PrincipalId),
        ]),
      }),
      tap(({ permissionSetName, accountName, principalName }) => {
        assert(permissionSetName);
        assert(accountName);
        assert(principalName);
      }),
      ({ permissionSetName, accountName, principalName }) =>
        `assignment::${permissionSetName}::${accountName}::${principalName}`,
    ])(),
  findId: pipe([
    get("live"),
    ({ PermissionSetArn, TargetId, PrincipalId }) =>
      `${PermissionSetArn}::${TargetId}::${PrincipalId}`,
  ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#getAccountAssignment-property
  getById: {
    method: "listAccountAssignments",
    pickId: pipe([
      pickId,
      ({ TargetId, ...other }) => ({
        AccountId: TargetId,
        ...other,
      }),
    ]),
    decorate: ({ endpoint, live }) =>
      pipe([
        get("AccountAssignments"),
        find(eq(get("PrincipalId"), live.PrincipalId)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#listAccountAssignments-property
  getList:
    ({ endpoint }) =>
    ({ lives, config }) =>
      pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "PermissionSet",
            group: "SSOAdmin",
          }),
        flatMap(({ live }) =>
          pipe([
            () => live,
            get("AccountIds"),
            flatMap(
              pipe([
                (AccountId) => ({
                  AccountId,
                  PermissionSetArn: live.PermissionSetArn,
                  InstanceArn: live.InstanceArn,
                }),
                endpoint().listAccountAssignments,
                get("AccountAssignments"),
                map(({ AccountId, ...other }) => ({
                  TargetId: AccountId,
                  ...other,
                })),
                map(
                  defaultsDeep({
                    PermissionSetArn: live.PermissionSetArn,
                    InstanceArn: live.InstanceArn,
                  })
                ),
              ])
            ),
          ])()
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#createAccountAssignment-property
  create: {
    method: "createAccountAssignment",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // isInstanceUp: () =>
    //   pipe([
    //     tap((params) => {
    //       assert(true);
    //     }),
    //     () => true,
    //   ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#updateAccountAssignment-property
  update: {
    method: "updateAccountAssignment",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#deleteAccountAssignment-property
  destroy: {
    method: "deleteAccountAssignment",
    pickId,
  },
  getByName:
    ({ endpoint }) =>
    ({
      name,
      resolvedDependencies: {
        user,
        group,
        targetAccount,
        identityStore,
        permissionSet,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(name);
          assert(targetAccount);
        }),
        () => ({
          AccountId: targetAccount.live.Id,
          InstanceArn: identityStore.live.InstanceArn,
          PermissionSetArn: permissionSet.live.PermissionSetArn,
        }),
        endpoint().listAccountAssignments,
        get("AccountAssignments"),
        find(
          or([
            eq(get("PrincipalId"), get("live.UserId")(user)),
            eq(get("PrincipalId"), get("live.GroupId")(group)),
          ])
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { identityStore, group, permissionSet, targetAccount, user },
  }) =>
    pipe([
      tap((params) => {
        assert(identityStore);
        assert(permissionSet);
        assert(targetAccount);
      }),
      () => otherProps,
      defaultsDeep({
        InstanceArn: getField(identityStore, "InstanceArn"),
        PermissionSetArn: getField(permissionSet, "PermissionSetArn"),
        TargetId: getField(targetAccount, "Id"),
      }),
      switchCase([
        () => user,
        assign({
          PrincipalId: () => getField(user, "UserId"),
          PrincipalType: () => "USER",
        }),
        () => group,
        assign({
          PrincipalId: () => getField(group, "GroupId"),
          PrincipalType: () => "GROUP",
        }),
        identity,
      ]),
    ])(),
});
