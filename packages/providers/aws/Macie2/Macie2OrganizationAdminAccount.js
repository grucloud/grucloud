const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, isEmpty, unless, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./Macie2Common");

const pickId = pipe([
  tap(({ adminAccountId }) => {
    assert(adminAccountId);
  }),
  pick(["adminAccountId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ accountId }) => {
      assert(endpoint);
      assert(accountId);
    }),
    ({ accountId, ...other }) => ({ adminAccountId: accountId, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2OrganizationAdminAccount = () => ({
  type: "OrganizationAdminAccount",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: ["adminAccountId", "Status"],
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
    accountDelegated: {
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listOrganizationAdminAccounts-property
  getById: {
    method: "listOrganizationAdminAccounts",
    pickId,
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live.adminAccountId);
        }),
        get("adminAccounts"),
        find(eq(get("accountId"), live.adminAccountId)),
        unless(isEmpty, decorate({ endpoint, live })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listOrganizationAdminAccounts-property
  getList: {
    method: "listOrganizationAdminAccounts",
    getParam: "adminAccounts",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#enableOrganizationAdminAccount -property
  create: {
    method: "enableOrganizationAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // TODO
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([() => diff])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#disableOrganizationAdminAccount-property
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
        adminAccountId: getField(accountDelegated, "Id"),
      }),
    ])(),
});
