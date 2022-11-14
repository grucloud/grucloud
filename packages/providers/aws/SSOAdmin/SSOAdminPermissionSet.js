const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map } = require("rubico");
const { defaultsDeep, isEmpty, unless } = require("rubico/x");

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
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ InstanceArn: live.InstanceArn }),
    tap((params) => {
      assert(true);
    }),
    assign({
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
        tap((params) => {
          assert(true);
        }),
        unless(isEmpty, JSON.parse),
        tap((params) => {
          assert(true);
        }),
      ]),
    }),
    omitIfEmpty(["ManagedPolicies", "CustomerManagedPolicies", "InlinePolicy"]),
    assignTags({
      endpoint,
      buildArn: buildArn(),
      InstanceArn: live.InstanceArn,
    }),
  ]);

const cannotBeDeleted = pipe([
  get("live"),
  eq(get("Name"), "AdministratorAccess"),
]);

const createInlinePolicy = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
    }),
    get("InlinePolicy"),
    JSON.stringify,
    (InlinePolicy) => ({ InlinePolicy }),
    defaultsDeep(pickId(live)),
    tap((params) => {
      assert(true);
    }),
    endpoint().putInlinePolicyToPermissionSet,
  ]);

const attachManagedPolicy = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
    }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#attachManagedPolicyToPermissionSet-property
    tap((params) => {
      assert(true);
    }),
    ({ Arn }) => ({
      ManagedPolicyArn: Arn,
    }),
    defaultsDeep(pickId(live)),
    tap((params) => {
      assert(true);
    }),
    endpoint().attachManagedPolicyToPermissionSet,
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
    tap((params) => {
      assert(true);
    }),
    endpoint().attachCustomerManagedPolicyReferenceToPermissionSet,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html
exports.SSOAdminPermissionSet = ({}) => ({
  package: "sso-admin",
  client: "SSOAdmin",
  type: "PermissionSet",
  propertiesDefault: {},
  omitProperties: ["PermissionSetArn", "CreatedDate", "InstanceArn"],
  inferName: pipe([
    get("properties.Name"),
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
  },
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  findName: pipe([
    get("live"),
    get("Name"),
    tap((name) => {
      assert(name);
    }),
  ]),
  findId: pipe([
    get("live"),
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
              map(attachManagedPolicy({ endpoint, live })),
            ])
          ),
          tap.if(
            get("CustomerManagedPolicies"),
            pipe([
              get("CustomerManagedPolicies"),
              map(attachCustomerPolicy({ endpoint, live })),
            ])
          ),
          tap.if(get("InlinePolicy"), createInlinePolicy({ endpoint, live })),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#updatePermissionSet-property
  update: {
    method: "updatePermissionSet",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#deletePermissionSet-property
  destroy: {
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
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff.liveDiff,
        tap.if(
          get("added.ManagedPolicy"),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => live,
            pickId,
            endpoint().deleteInlinePolicyFromPermissionSet,
          ])
        ),
        tap.if(
          get("deleted.InlinePolicy"),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => live,
            pickId,
            endpoint().deleteInlinePolicyFromPermissionSet,
          ])
        ),
        tap.if(
          get("added.InlinePolicy"),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => payload,
            createInlinePolicy({ endpoint, live }),
          ])
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
