const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, assignTags } = require("./XRayCommon");

const managedByOther = () => pipe([eq(get("RuleName"), "Default")]);

const buildArn = () =>
  pipe([
    get("RuleARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ RuleARN }) => {
    assert(RuleARN);
  }),
  pick(["RuleARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    get("SamplingRule"),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html
exports.XRaySamplingRule = () => ({
  type: "SamplingRule",
  package: "xray",
  client: "XRay",
  propertiesDefault: {},
  omitProperties: ["RuleARN"],
  inferName: () =>
    pipe([
      get("RuleName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("RuleName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("RuleARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidRequestException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        ResourceARN: pipe([
          get("ResourceARN"),
          replaceAccountAndRegion({ lives, providerConfig }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#getSamplingRule-property
  getById: {
    method: "getSamplingRules",
    pickId,
    decorate: ({ live }) =>
      pipe([
        get("SamplingRuleRecords"),
        find(eq(get("SamplingRule.RuleARN"), live.RuleARN)),
        get("SamplingRule"),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#listSamplingRules-property
  getList: {
    method: "getSamplingRules",
    getParam: "SamplingRuleRecords",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#createSamplingRule-property
  create: {
    method: "createSamplingRule",
    filterPayload: ({ Tags, ...SamplingRule }) => ({ SamplingRule, Tags }),
    pickCreated: ({ payload }) =>
      pipe([get("SamplingRuleRecord.SamplingRule")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#updateSamplingRule-property
  update: {
    method: "updateSamplingRule",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => ({ SamplingRuleUpdate: paylaod }),
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/XRay.html#deleteSamplingRule-property
  destroy: {
    method: "deleteSamplingRule",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
