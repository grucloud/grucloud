const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./ApplicationInsightsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ResourceGroupName }) => {
    assert(ResourceGroupName);
  }),
  pick(["ResourceGroupName"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ ResourceGroupName }) => {
          assert(ResourceGroupName);
        }),
        ({ ResourceGroupName }) =>
          `arn:${config.partition}:applicationinsights:${
            config.region
          }:${config.accountId()}:application/resource-group/${ResourceGroupName}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    ({ DiscoveryType, ...other }) => ({
      ...other,
      GroupingType: DiscoveryType,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html
exports.ApplicationInsightsApplication = () => ({
  type: "Application",
  package: "application-insights",
  client: "ApplicationInsights",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "OpsItemSNSTopicArn",
    "LifeCycle",
    "Remarks",
    "AccountId",
    "ConfigurationHistoryEventErrorCount",
    "ConfigurationHistoryEventInfoCount",
    "ConfigurationHistoryEventWarnCount",
    "HighSeverityProblemsCount",
    "LowSeverityProblemsCount",
    "MediumSeverityProblemsCount",
  ],
  inferName: () =>
    pipe([
      get("ResourceGroupName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ResourceGroupName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ResourceGroupName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("OpsItemSNSTopicArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html#getApplication-property
  getById: {
    method: "describeApplication",
    getField: "ApplicationInfo",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "ApplicationInfoList",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([get("ApplicationInfo")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApplicationInsights.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
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
    dependencies: { snsTopic },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => snsTopic,
        defaultsDeep({
          OpsItemSNSTopicArn: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
    ])(),
});
