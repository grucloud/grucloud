const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { findNameInTagsOrId } = require("../AwsCommon");

const { tagResource, untagResource } = require("./EC2Common");

const findId = () =>
  pipe([
    get("NetworkInsightsAnalysisId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2NetworkInsightsAnalysis = () => ({
  type: "NetworkInsightsAnalysis",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "NetworkInsightsAnalysisArn",
    "NetworkInsightsAnalysisId",
    "NetworkInsightsPathId",
    "AdditionalAccounts",
    "FilterInArns",
    "StartDate",
    "Status",
    "StatusMessage",
    "WarningMessage",
    "NetworkPathFound",
    "CreatedDate",
    "UpdatedDate",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParameterValue"],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsAnalyses-property
  getById: {
    method: "describeNetworkInsightsAnalyses",
    getField: "NetworkInsightsAnalyses",
    pickId: pipe([
      tap(({ NetworkInsightsAnalysisId }) => {
        assert(NetworkInsightsAnalysisId);
      }),
      ({ NetworkInsightsAnalysisId }) => ({
        NetworkInsightsAnalysisIds: [NetworkInsightsAnalysisId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsAnalyses-property
  getList: {
    method: "describeNetworkInsightsAnalyses",
    getParam: "NetworkInsightsAnalyses",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkInsightsAnalysis-property
  create: {
    method: "createNetworkInsightsAnalysis",
    pickCreated: ({ payload }) => pipe([get("NetworkInsightsAnalysis")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNetworkInsightsAnalysis-property
  destroy: {
    method: "deleteNetworkInsightsAnalysis",
    pickId: pipe([pick(["NetworkInsightsAnalysisId"])]),
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
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
        TagSpecifications: [
          {
            ResourceType: "network-insights-analysis",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
