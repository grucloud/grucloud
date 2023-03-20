const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ GroupName, Namespace }) => {
    assert(GroupName);
  }),
  pick(["GroupName", "Namespace", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ Namespace: "default" }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightGroup = () => ({
  type: "Group",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: ["Arn", "AwsAccountId"],
  inferName: () =>
    pipe([
      get("GroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("GroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("GroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    namespace: {
      type: "Namespace",
      group: "QuickSight",
      parent: true,
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Namespace"),
          tap((Namespace) => {
            assert(true);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeGroup-property
  getById: {
    method: "describeGroup",
    getField: "Group",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listGroups-property
  // TODO list namespace
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId(), Namespace: "default" }),
    method: "listGroups",
    getParam: "Groups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createGroup-property
  create: {
    method: "createGroup",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateGroup-property
  update: {
    method: "updateGroup",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteGroup-property
  destroy: {
    method: "deleteGroup",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties: { ...otherProps },
    dependencies: { namespace },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Namespace: "default",
      }),
      // TODO namespace
    ])(),
});
