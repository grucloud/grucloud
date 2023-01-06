const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ StandardsSubscriptionArn }) => {
    assert(StandardsSubscriptionArn);
  }),
  ({ StandardsSubscriptionArn }) => ({
    StandardsSubscriptionArns: [StandardsSubscriptionArn],
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubStandardsSubscription = () => ({
  type: "StandardsSubscription",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["StandardsSubscriptionArn", "StandardsStatus"],
  inferName: () =>
    pipe([
      get("StandardsArn"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("StandardsArn"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StandardsSubscriptionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    securityHubAccount: {
      type: "Account",
      group: "SecurityHub",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  ignoreErrorCodes,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        StandardsArn: pipe([
          get("StandardsArn"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getStandardsSubscription-property
  getById: {
    method: "getEnabledStandards",
    getField: "StandardsSubscriptions",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listStandardsSubscriptions-property
  getList: {
    method: "getEnabledStandards",
    getParam: "StandardsSubscriptions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createStandardsSubscription-property
  create: {
    filterPayload: (payload) =>
      pipe([
        () => ({
          StandardsSubscriptionRequests: [payload],
        }),
      ])(),
    method: "batchEnableStandards",
    pickCreated: ({ payload }) => pipe([get("StandardsSubscriptions"), first]),
    // isInstanceUp: pipe([eq(get("StandardsStatus"), "READY")]),
    // isInstanceError: pipe([eq(get("StandardsStatus"), "FAILED")]),
    // getErrorMessage: get("StandardsStatusReason", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateStandardsSubscription-property
  update: {
    method: "batchEnableStandards",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        //
        () => payload,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteStandardsSubscription-property
  destroy: {
    method: "batchDisableStandards",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
