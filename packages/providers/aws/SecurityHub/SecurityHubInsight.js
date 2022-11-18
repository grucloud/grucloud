const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ InsightArn }) => {
    assert(InsightArn);
  }),
  pick(["InsightArn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const extractName = pipe([
  get("Name"),
  tap((Name) => {
    assert(Name);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubInsight = () => ({
  type: "Insight",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["InsightArn"],
  inferName: pipe([get("properties"), extractName]),
  findName: pipe([get("live"), extractName]),
  findId: pipe([
    get("live"),
    get("InsightArn"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getInsights-property
  getById: {
    method: "getInsights",
    getField: "Insights",
    pickId: pipe([
      tap(({ InsightArn }) => {
        assert(InsightArn);
      }),
      ({ InsightArn }) => ({
        InsightArns: [InsightArn],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getInsights-property
  getList: {
    method: "getInsights",
    getParam: "Insights",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createInsight-property
  create: {
    method: "createInsight",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateInsight-property
  update: {
    method: "updateInsight",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        //
        () => payload,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteInsight-property
  destroy: {
    method: "deleteInsight",
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
