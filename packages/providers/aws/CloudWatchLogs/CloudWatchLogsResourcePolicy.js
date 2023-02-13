const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { find, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const pickId = pipe([
  tap(({ policyName }) => {
    assert(policyName);
  }),
  pick(["policyName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      policyDocument: pipe([get("policyDocument"), JSON.parse]),
    }),
  ]);

const filterPayload = pipe([
  assign({ policyDocument: pipe([get("policyDocument"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  propertiesDefault: {},
  omitProperties: ["lastUpdatedTime"],
  inferName: () =>
    pipe([
      get("policyName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("policyName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("policyName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        policyDocument: pipe([
          get("policyDocument"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#getResourcePolicy-property
  getById: {
    method: "describeResourcePolicies",
    pickId,
    decorate: ({ live }) =>
      pipe([
        get("resourcePolicies"),
        find(eq(get("policyName"), live.policyName)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeResourcePolicies-property
  getList: {
    method: "describeResourcePolicies",
    getParam: "resourcePolicies",
    decorate,
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putResourcePolicy-property
  create: {
    filterPayload,
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#updateResourcePolicy-property
  update: {
    method: "updateResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
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
