const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ AwsAccountId }) => {
    assert(AwsAccountId);
  }),
  pick(["AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
    //TODO
    // describeAccountSettings  AccountSettings
  ]);

const findName = () => pipe([() => "default"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightAccountSubscription = () => ({
  type: "AccountSubscription",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["AccountSubscriptionStatus"],
  inferName: findName,
  findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // TODO no api exists that return the DirectoryId
  dependencies: {
    directory: {
      type: "Directory",
      group: "DirectoryService",
      dependencyId: ({ lives, config }) => pipe([get("DirectoryId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#getAccountSubscription-property
  getById: {
    method: "describeAccountSubscription",
    getField: "AccountInfo",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listAccountSubscriptions-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "describeAccountSubscription",
    getParam: "AccountInfo",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createAccountSubscription-property
  create: {
    method: "createAccountSubscription",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateAccountSubscription-property
  update: {
    method: "updateAccountSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteAccountSubscription-property
  destroy: {
    method: "deleteAccountSubscription",
    pickId,
    isInstanceDown: pipe([
      tap((params) => {
        assert(true);
      }),
      () => true,
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { directory },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ AwsAccountId: config.accountId() }),
      when(
        () => directory,
        defaultsDeep({
          DirectoryId: getField(directory, "DirectoryId"),
        })
      ),
    ])(),
});
