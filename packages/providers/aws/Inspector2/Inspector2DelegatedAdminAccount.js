const assert = require("assert");
const { pipe, tap, pick, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([pick(["delegatedAdminAccountId"])]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2DelegatedAdminAccount = () => ({
  type: "DelegatedAdminAccount",
  package: "inspector2",
  client: "Inspector2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  inferName: () => () => "default",
  omitProperties: ["status", "delegatedAdminAccountId"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      dependencyId: () => pipe([get("delegatedAdminAccountId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#listDelegatedAdminAccounts-property
  getList: {
    method: "listDelegatedAdminAccounts",
    getParam: "delegatedAdminAccounts",
    decorate: ({ getById }) =>
      pipe([
        ({ accountId, ...other }) => ({
          delegatedAdminAccountId: accountId,
          ...other,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#enableDelegatedAdminAccount-property
  create: {
    method: "enableDelegatedAdminAccount",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#disableDelegatedAdminAccount-property
  destroy: {
    method: "disableDelegatedAdminAccount",
    pickId,
  },
  //TODO
  update:
    ({ endpoint }) =>
    ({ payload, live }) =>
      pipe([
        () => live,
        endpoint().disableDelegatedAdminAccount,
        () => payload,
        endpoint().enableDelegatedAdminAccount,
      ])(),
  getByName: ({ getList, endpoint, getById }) => pipe([getList]),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { account },
  }) =>
    pipe([
      tap((params) => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        delegatedAdminAccountId: getField(account, "Id"),
      }),
    ])(),
});
