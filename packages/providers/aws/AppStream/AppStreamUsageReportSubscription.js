const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { first, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const inferName = () => pipe([() => "default"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamUsageReportSubscription = () => ({
  type: "UsageReportSubscription",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {},
  inferName,
  findName: inferName,
  findId: inferName,
  omitProperties: [],
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUsageReportSubscriptions-property
  getById: {
    method: "describeUsageReportSubscriptions",
    decorate: ({ live }) => pipe([get("UsageReportSubscriptions"), first]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUsageReportSubscriptions-property
  getList: {
    method: "describeUsageReportSubscriptions",
    getParam: "UsageReportSubscriptions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createUsageReportSubscription-property
  create: {
    method: "createUsageReportSubscription",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateUsageReportSubscription-property
  update: {
    method: "createUsageReportSubscription",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteUsageReportSubscription-property
  destroy: {
    method: "deleteUsageReportSubscription",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps])(),
});
