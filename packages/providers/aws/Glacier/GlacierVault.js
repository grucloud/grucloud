const assert = require("assert");
const { pipe, tap, get, pick, assign, tryCatch, fork } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");

const { assignPolicyAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap(({ vaultName, accountId }) => {
    assert(vaultName);
    assert(accountId);
  }),
  pick(["vaultName", "accountId"]),
]);

const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([endpoint().listTagsForVault, get("Tags")]),
        (error) => []
      ),
    }),
  ]);

const assignNotification =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      tryCatch(
        pipe([
          endpoint().getVaultNotifications,
          get("vaultNotificationConfig"),
          assign({
            Events: pipe([
              get("Events"),
              callProp("sort", (a, b) => a.localeCompare(b)),
            ]),
          }),
          (vaultNotificationConfig) => ({ ...live, vaultNotificationConfig }),
        ]),
        (error) => live
      ),
    ])();

const assignAccessPolicy =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      tryCatch(
        pipe([
          endpoint().getVaultAccessPolicy,
          get("policy.Policy"),
          JSON.parse,
          (Policy) => ({ ...live, policy: { Policy } }),
        ]),
        (error) => live
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ accountId: "-" }),
    ({ VaultName, ...other }) => ({ vaultName: VaultName, ...other }),
    assignTags({ endpoint }),
    assignNotification({ endpoint }),
    assignAccessPolicy({ endpoint }),
  ]);

const setVaultAccessPolicy = ({ endpoint }) =>
  pipe([
    assign({
      policy: pipe([
        get("policy"),
        assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
      ]),
    }),
    endpoint().setVaultAccessPolicy,
  ]);

const deleteVaultAccessPolicy = ({ endpoint }) =>
  pipe([endpoint().deleteVaultAccessPolicy]);

const setVaultNotifications = ({ endpoint }) =>
  pipe([endpoint().setVaultNotifications]);

const deleteVaultNotifications = ({ endpoint }) =>
  pipe([endpoint().deleteVaultNotifications]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html
exports.GlacierVault = () => ({
  type: "Vault",
  package: "glacier",
  client: "Glacier",
  propertiesDefault: { accountId: "-" },
  omitProperties: [
    "CreationDate",
    "SizeInBytes",
    "VaultARN",
    "NumberOfArchives",
    "vaultNotificationConfig.SNSTopic",
  ],
  inferName: () =>
    pipe([
      get("vaultName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("vaultName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("VaultARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("vaultNotificationConfig.SNSTopic")]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        policy: pipe([
          get("policy"),
          assign({
            Policy: pipe([
              get("Policy"),
              assignPolicyAccountAndRegion({ providerConfig, lives }),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#describeVault-property
  getById: {
    method: "describeVault",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#listVaults-property
  getList: {
    enhanceParams: () => () => ({ accountId: "-" }),
    method: "listVaults",
    getParam: "VaultList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#createVault-property
  create: {
    method: "createVault",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ name, endpoint, payload, config }) =>
      (live) =>
        pipe([
          //
          () => payload,
          fork({
            tags: endpoint().addTagsToVault,
            notification: pipe([
              when(
                get("vaultNotificationConfig.SNSTopic"),
                endpoint().setVaultNotifications
              ),
            ]),
            accessPolicy: pipe([
              when(get("policy"), setVaultAccessPolicy({ endpoint })),
            ]),
          }),
        ])(),
  },
  // Update
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "vaultNotificationConfig",
          onDeleted: deleteVaultNotifications,
          onAdded: setVaultNotifications,
          onUpdated: setVaultNotifications,
        }),
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "policy",
          onDeleted: deleteVaultAccessPolicy,
          onAdded: setVaultAccessPolicy,
          onUpdated: setVaultAccessPolicy,
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#deleteVault-property
  destroy: {
    method: "deleteVault",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource:
      ({ endpoint, endpointConfig }) =>
      ({ live }) =>
      (Tags) =>
        pipe([
          tap(() => {
            assert(live.accountId);
            assert(live.vaultName);
            assert(Tags);
            assert(endpoint);
          }),
          () => live,
          pick(["accountId", "vaultName"]),
          defaultsDeep({ Tags }),
          endpoint(endpointConfig).addTagsToVault,
        ])(),
    untagResource:
      ({ endpoint, endpointConfig }) =>
      ({ live }) =>
      (TagKeys) =>
        pipe([
          tap(() => {
            assert(live.accountId);
            assert(live.vaultName);
            assert(TagKeys);
            assert(endpoint);
          }),
          () => live,
          pick(["accountId", "vaultName"]),
          defaultsDeep({ TagKeys }),
          endpoint(endpointConfig).removeTagsFromVault,
        ])(),
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { snsTopic },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => snsTopic,
        defaultsDeep({
          vaultNotificationConfig: {
            SNSTopic: getField(snsTopic, "Attributes.TopicArn"),
          },
        })
      ),
    ])(),
});
