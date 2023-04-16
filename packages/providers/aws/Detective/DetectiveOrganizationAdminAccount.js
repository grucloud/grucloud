const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const ignoreErrorMessages = [
  "The request failed because a delegated administrator account has not been enabled",
];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html
exports.DetectiveOrganizationAdminAccount = () => ({
  type: "OrganizationAdminAccount",
  package: "detective",
  client: "Detective",
  propertiesDefault: {},
  omitProperties: ["DelegationTime"],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () =>
    pipe([
      get("GraphArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      dependencyId: () =>
        pipe([
          get("AccountId"),
          tap((AccountId) => {
            assert(AccountId);
          }),
        ]),
    },
    graph: {
      type: "Graph",
      group: "Detective",
      dependencyId: () =>
        pipe([
          get("GraphArn"),
          tap((GraphArn) => {
            assert(GraphArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listOrganizationAdminAccounts-property
  getById: {
    method: "listOrganizationAdminAccounts",
    getField: "OrganizationAdminAccount",
    pickId,
    decorate: ({ live, config, endpoint }) =>
      pipe([
        tap((params) => {
          assert(live.GraphArn);
        }),
        get("Administrators"),
        find(eq(get("GraphArn"), live.GraphArn)),
        unless(isEmpty, decorate({ config, endpoint })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#listOrganizationAdminAccounts-property
  getList: {
    method: "listOrganizationAdminAccounts",
    getParam: "Administrators",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#enableOrganizationAdminAccount-property
  create: {
    method: "enableOrganizationAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Detective.html#disableOrganizationAdminAccount-property
  destroy: {
    method: "disableOrganizationAdminAccount",
    pickId,
    ignoreErrorMessages,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({ AccountId: getField(account, "Id") }),
    ])(),
});
