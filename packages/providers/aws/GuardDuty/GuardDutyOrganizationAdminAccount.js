const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, isEmpty, unless, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./GuardDutyCommon");

const ignoreErrorMessages = [
  "The request failed because a delegated administrator account has not been enabled",
];

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
    ({ AdminStatus, ...other }) => ({ AdminEnable: AdminStatus, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html
exports.GuardDutyOrganizationAdminAccount = () => ({
  type: "OrganizationAdminAccount",
  package: "guardduty",
  client: "GuardDuty",
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
        assert(lives);
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listOrganizationAdminAccounts-property
  getById: {
    method: "listOrganizationAdminAccounts",
    pickId,
    ignoreErrorMessages,
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live.AdminAccountId);
        }),
        get("AdminAccounts"),
        tap((params) => {
          assert(true);
        }),

        find(eq(get("AdminAccountId"), live.AdminAccountId)),
        tap((params) => {
          assert(true);
        }),
        unless(isEmpty, decorate({ endpoint, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#listOrganizationAdminAccounts-property
  getList: {
    method: "listOrganizationAdminAccounts",
    getParam: "AdminAccounts",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#createOrganizationAdminAccount-property
  create: {
    method: "enableOrganizationAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: () => true,
  },
  // TODO
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([() => diff])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html#disableOrganizationAdminAccount-property
  destroy: {
    method: "disableOrganizationAdminAccount",
    pickId,
    ignoreErrorMessages,
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
