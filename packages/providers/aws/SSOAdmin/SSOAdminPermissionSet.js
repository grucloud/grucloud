const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, or, filter } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  unless,
  keys,
  isDeepEqual,
} = require("rubico/x");
const Diff = require("diff");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SSOAdminCommon");

const buildArn = () =>
  pipe([
    get("PermissionSetArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),

  tap(({ InstanceArn, PermissionSetArn }) => {
    assert(InstanceArn);
    assert(PermissionSetArn);
  }),
  pick(["InstanceArn", "PermissionSetArn"]),
]);

const assignTags = ({ buildArn, endpoint, InstanceArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ InstanceArn, ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const decorate = ({ endpoint, live }) =>
  pipe([
    defaultsDeep({ InstanceArn: live.InstanceArn }),
    assign({
      AccountIds: pipe([
        pickId,
        endpoint().listAccountsForProvisionedPermissionSet,
        get("AccountIds"),
      ]),
      ManagedPolicies: pipe([
        pickId,
        endpoint().listManagedPoliciesInPermissionSet,
        get("AttachedManagedPolicies"),
      ]),
      CustomerManagedPolicies: pipe([
        pickId,
        endpoint().listCustomerManagedPolicyReferencesInPermissionSet,
        get("CustomerManagedPolicyReferences"),
      ]),
      InlinePolicy: pipe([
        pickId,
        endpoint().getInlinePolicyForPermissionSet,
        get("InlinePolicy"),
        unless(isEmpty, JSON.parse),
      ]),
    }),
    omitIfEmpty(["ManagedPolicies", "CustomerManagedPolicies", "InlinePolicy"]),
    assignTags({
      endpoint,
      buildArn: buildArn(),
      InstanceArn: live.InstanceArn,
    }),
  ]);

const cannotBeDeleted = () => pipe([eq(get("Name"), "AdministratorAccess")]);

const createInlinePolicy = ({ endpoint, live }) =>
  pipe([
    get("InlinePolicy"),
    JSON.stringify,
    (InlinePolicy) => ({ InlinePolicy }),
    defaultsDeep(pickId(live)),
    endpoint().putInlinePolicyToPermissionSet,
  ]);

const attachManagedPolicy = ({ endpoint, live }) =>
  pipe([
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#attachManagedPolicyToPermissionSet-property
    ({ Arn }) => ({
      ManagedPolicyArn: Arn,
    }),
    defaultsDeep(pickId(live)),
    endpoint().attachManagedPolicyToPermissionSet,
  ]);

const detachManagedPolicy = ({ endpoint, live }) =>
  pipe([
    ({ Arn }) => ({
      ManagedPolicyArn: Arn,
    }),
    defaultsDeep(pickId(live)),
    endpoint().detachManagedPolicyFromPermissionSet,
  ]);

const attachCustomerPolicy = ({ endpoint, live }) =>
  pipe([
    tap(({ Name, Path }) => {
      assert(Path);
      assert(Name);
    }),
    ({ Name, Path }) => ({
      CustomerManagedPolicyReference: { Name, Path },
    }),
    defaultsDeep(pickId(live)),
    endpoint().attachCustomerManagedPolicyReferenceToPermissionSet,
  ]);

const detachCustomerPolicy = ({ endpoint, live }) =>
  pipe([
    tap(({ Name, Path }) => {
      assert(Path);
      assert(Name);
    }),
    ({ Name, Path }) => ({
      CustomerManagedPolicyReference: { Name, Path },
    }),
    defaultsDeep(pickId(live)),
    endpoint().detachCustomerManagedPolicyReferenceFromPermissionSet,
  ]);

const diffArrayOptions = {
  comparator: (left, right) => {
    return isDeepEqual(left, right);
  },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html
exports.SSOAdminPermissionSet = ({}) => ({
  package: "sso-admin",
  client: "SSOAdmin",
  type: "PermissionSet",
  propertiesDefault: {},
  omitProperties: [
    "PermissionSetArn",
    "CreatedDate",
    "InstanceArn",
    "AccountIds",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      //excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
    iamPolicies: {
      type: "Policy",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("CustomerManagedPolicies"),
          map(
            pipe([
              get("Name"),
              lives.getByName({
                type: "Policy",
                group: "IAM",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
  },
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PermissionSetArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#getPermissionSet-property
  getById: {
    method: "describePermissionSet",
    getField: "PermissionSet",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#createPermissionSet-property
  create: {
    method: "createPermissionSet",
    pickCreated: ({ payload }) =>
      pipe([
        get("PermissionSet"),
        defaultsDeep({ InstanceArn: payload.InstanceArn }),
      ]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#attachManagedPolicyToPermissionSet-property
          tap.if(
            get("ManagedPolicies"),
            pipe([
              get("ManagedPolicies"),
              map.series(attachManagedPolicy({ endpoint, live })),
            ])
          ),
          tap.if(
            get("CustomerManagedPolicies"),
            pipe([
              get("CustomerManagedPolicies"),
              map.series(attachCustomerPolicy({ endpoint, live })),
            ])
          ),
          tap.if(get("InlinePolicy"), createInlinePolicy({ endpoint, live })),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#deletePermissionSet-property
  destroy: {
    preDestroy:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => live,
          get("AccountIds"),
          map(
            pipe([
              (AccountId) => ({
                AccountId,
                PermissionSetArn: live.PermissionSetArn,
                InstanceArn: live.InstanceArn,
              }),
              endpoint().listAccountAssignments,
              get("AccountAssignments"),
              map(
                pipe([
                  ({ AccountId, ...other }) => ({
                    TargetId: AccountId,
                    ...other,
                  }),
                  defaultsDeep({
                    PermissionSetArn: live.PermissionSetArn,
                    InstanceArn: live.InstanceArn,
                    TargetType: "AWS_ACCOUNT",
                  }),
                  endpoint().deleteAccountAssignment,
                ])
              ),
            ])
          ),
        ])(),
    method: "deletePermissionSet",
    pickId,
  },
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Instance", group: "SSOAdmin" },
          pickKey: pipe([
            pick(["InstanceArn"]),
            tap(({ InstanceArn }) => {
              assert(InstanceArn);
            }),
          ]),
          method: "listPermissionSets",
          getParam: "PermissionSets",
          config,
          decorate: ({ parent }) =>
            pipe([
              (PermissionSetArn) => ({
                InstanceArn: parent.InstanceArn,
                PermissionSetArn,
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#updatePermissionSet-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => diff,
        tap.if(
          or([
            get("liveDiff.updated.ManagedPolicies"),
            get("targetDiff.added.ManagedPolicies"),
            get("liveDiff.added.ManagedPolicies"),
          ]),
          pipe([
            () =>
              Diff.diffArrays(
                live.ManagedPolicies || [],
                payload.ManagedPolicies || [],
                diffArrayOptions
              ),
            (arrayDiff) =>
              pipe([
                () => arrayDiff,
                filter(get("removed")),
                map(
                  pipe([
                    get("value"),
                    map.series(detachManagedPolicy({ endpoint, live })),
                  ])
                ),
                () => arrayDiff,
                filter(get("added")),
                map(
                  pipe([
                    get("value"),
                    map.series(attachManagedPolicy({ endpoint, live })),
                  ])
                ),
              ])(),
          ])
        ),
        tap.if(
          or([
            get("liveDiff.updated.CustomerManagedPolicies"),
            get("targetDiff.added.CustomerManagedPolicies"),
            get("liveDiff.added.CustomerManagedPolicies"),
          ]),
          pipe([
            () =>
              Diff.diffArrays(
                live.CustomerManagedPolicies || [],
                payload.CustomerManagedPolicies || [],
                diffArrayOptions
              ),
            (arrayDiff) =>
              pipe([
                () => arrayDiff,
                filter(get("removed")),
                map(
                  pipe([
                    get("value"),
                    map.series(detachCustomerPolicy({ endpoint, live })),
                  ])
                ),
                () => arrayDiff,
                filter(get("added")),
                map(
                  pipe([
                    get("value"),
                    map.series(attachCustomerPolicy({ endpoint, live })),
                  ])
                ),
              ])(),
          ])
        ),
        tap.if(
          get("targetDiff.added.InlinePolicy"),
          pipe([
            () => live,
            pickId,
            endpoint().deleteInlinePolicyFromPermissionSet,
          ])
        ),
        tap.if(
          or([
            get("liveDiff.added.InlinePolicy"),
            get("liveDiff.updated.InlinePolicy"),
          ]),
          pipe([() => payload, createInlinePolicy({ endpoint, live })])
        ),
      ])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn(config),
      additionalParams: pipe([pick(["InstanceArn"])]),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { identityStore },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(config);
        assert(identityStore);
      }),
      () => otherProps,
      defaultsDeep({
        InstanceArn: getField(identityStore, "InstanceArn"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
