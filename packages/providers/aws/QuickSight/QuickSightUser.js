const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ UserName }) => {
    assert(UserName);
  }),
  pick(["UserName", "Namespace", "AwsAccountId"]),
  defaultsDeep({ Namespace: "default" }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightUser = () => ({
  type: "User",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: { Namespace: "default" },
  omitProperties: ["IamArn", "AwsAccountId"],
  inferName: () =>
    pipe([
      get("UserName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("UserName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      tap((params) => {
        assert(params);
      }),
      get("UserName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeUser-property
  getById: {
    method: "describeUser",
    getField: "User",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listUsers-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId(), Namespace: "default" }),
    method: "listUsers",
    getParam: "UserList",
    decorate,
  },
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("IamArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#registerUser-property
  create: {
    method: "registerUser",
    pickCreated: ({ payload }) => pipe([get("User")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteUser-property
  destroy: {
    method: "deleteUser",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ AwsAccountId: config.accountId() }),
      when(
        () => iamRole,
        defaultsDeep({
          IamArn: getField(iamRole, "Arn"),
        })
      ),
    ])(),
});
