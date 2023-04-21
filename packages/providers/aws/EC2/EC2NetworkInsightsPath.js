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
    get("NetworkInsightsPathId"),
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
exports.EC2NetworkInsightsPath = () => ({
  type: "NetworkInsightsPath",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "NetworkInsightsPathArn",
    "NetworkInsightsPathId",
    "CreatedDate",
    "UpdatedDate",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParameterValue"],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsPaths-property
  getById: {
    method: "describeNetworkInsightsPaths",
    getField: "NetworkInsightsPaths",
    pickId: pipe([
      tap(({ NetworkInsightsPathId }) => {
        assert(NetworkInsightsPathId);
      }),
      ({ NetworkInsightsPathId }) => ({
        NetworkInsightsPathIds: [NetworkInsightsPathId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsPaths-property
  getList: {
    method: "describeNetworkInsightsPaths",
    getParam: "NetworkInsightsPaths",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkInsightsPath-property
  create: {
    method: "createNetworkInsightsPath",
    pickCreated: ({ payload }) => pipe([get("NetworkInsightsPath")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNetworkInsightsPath-property
  destroy: {
    method: "deleteNetworkInsightsPath",
    pickId: pipe([pick(["NetworkInsightsPathId"])]),
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
            ResourceType: "network-insights-path",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
