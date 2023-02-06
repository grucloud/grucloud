const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./AuditManagerCommon");

const pickId = pipe([
  tap(({ adminAccountId }) => {
    assert(adminAccountId);
  }),
  pick(["adminAccountId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ adminAccountId }) => {
      assert(endpoint);
      assert(adminAccountId);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html
exports.AuditManagerOrganizationAdminAccount = () => ({
  type: "OrganizationAdminAccount",
  package: "auditmanager",
  client: "AuditManager",
  propertiesDefault: {},
  omitProperties: ["adminAccountId", "organizationId"],
  inferName:
    ({ dependenciesSpec: { accountAdmin } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(accountAdmin);
        }),
        () => accountAdmin,
      ])(),
  findName: ({ lives, config }) =>
    pipe([
      get("adminAccountId"),
      tap((id) => {
        assert(id);
      }),
      lives.getById({
        type: "Account",
        group: "Organisations",
      }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("adminAccountId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    accountAdmin: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("adminAccountId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listOrganizationAdminAccounts-property
  getById: {
    method: "getOrganizationAdminAccount",
    pickId: () => ({}),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#listOrganizationAdminAccounts-property
  getList: {
    method: "getOrganizationAdminAccount",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#registerOrganizationAdminAccount -property
  create: {
    method: "registerOrganizationAdminAccount",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html#deregisterOrganizationAdminAccount-property
  destroy: {
    method: "deregisterOrganizationAdminAccount",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { accountAdmin },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(accountAdmin);
      }),
      () => otherProps,
      defaultsDeep({
        adminAccountId: getField(accountAdmin, "Id"),
      }),
    ])(),
});
