const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, isEmpty, unless, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ AdminAccountId }) => {
    assert(AdminAccountId);
  }),
  pick(["AdminAccountId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ AccountId, ...other }) => ({ AdminAccountId: AccountId, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubOrganizationAdminAccount = () => ({
  type: "OrganizationAdminAccount",
  package: "SecurityHub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["AdminAccountId", "Status"],
  inferName:
    ({ dependenciesSpec: { accountDelegated } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(accountDelegated);
        }),
        () => accountDelegated,
      ])(),
  findName: ({ lives, config }) =>
    pipe([
      get("AdminAccountId"),
      tap((id) => {
        assert(id);
      }),
      (id) =>
        lives.getById({
          id,
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
      get("AdminAccountId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    accountDelegated: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("AdminAccountId")]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listOrganizationAdminAccounts-property
  getById: {
    method: "listOrganizationAdminAccounts",
    pickId,
    decorate: ({ endpoint, live }) =>
      pipe([
        get("AdminAccounts"),
        find(eq(get("AccountId"), live.AdminAccountId)),
        unless(isEmpty, decorate({ endpoint, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listOrganizationAdminAccounts-property
  getList: {
    method: "listOrganizationAdminAccounts",
    getParam: "AdminAccounts",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createOrganizationAdminAccount-property
  create: {
    method: "enableOrganizationAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // TODO
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([() => diff])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteOrganizationAdminAccount-property
  destroy: {
    method: "disableOrganizationAdminAccount",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { accountDelegated },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(accountDelegated);
      }),
      () => otherProps,
      defaultsDeep({
        AdminAccountId: getField(accountDelegated, "Id"),
      }),
    ])(),
});
