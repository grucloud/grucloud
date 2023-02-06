const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./AuditManagerCommon");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      delegatedAdminAccount: pipe([
        endpoint().getOrganizationAdminAccount,
        get("adminAccountId"),
        tap((params) => {
          assert(true);
        }),
      ]),
      kmsKey: pipe([
        () => ({ attribute: "ALL" }),
        endpoint().getSettings,
        tap((params) => {
          assert(true);
        }),
        get("settings"),
        get("kmsKey"),
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

const findName = () => pipe([() => "default"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerAccountRegistration = () => ({
  type: "AccountRegistration",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: ["kmsKey", "delegatedAdminAccount", "status"],
  inferName: findName,
  findName: findName,
  findId: findName,
  ignoreErrorCodes,
  dependencies: {
    accountDelegatedAdmin: {
      type: "Account",
      group: "Organisations",
      //excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("delegatedAdminAccount"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsKey"),
    },
  },
  getById: {
    method: "getAccountStatus",
    pickId: () => ({}),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#getAccountStatus-property
  getList: {
    method: "getAccountStatus",
    pickId: () => ({}),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#registerAccount-property
  create: {
    method: "registerAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#registerAccount-property
  update: {
    method: "registerAccount",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deregisterAccount-property
  destroy: {
    method: "deregisterAccount",
    pickId,
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { kmsKey, accountDelegatedAdmin },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => accountDelegatedAdmin,
        defaultsDeep({
          delegatedAdminAccount: getField(accountDelegatedAdmin, "Id"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
