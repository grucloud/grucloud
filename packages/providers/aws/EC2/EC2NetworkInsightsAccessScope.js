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
    get("NetworkInsightsAccessScopeId"),
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
exports.EC2NetworkInsightsAccessScope = () => ({
  type: "NetworkInsightsAccessScope",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [
    "NetworkInsightsAccessScopeArn",
    "NetworkInsightsAccessScopeId",
    "CreatedDate",
    "UpdatedDate",
  ],
  findName: findNameInTagsOrId({ findId }),
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException", "InvalidParameterValue"],
  dependencies: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsAccessScopes-property
  getById: {
    method: "describeNetworkInsightsAccessScopes",
    getField: "NetworkInsightsAccessScopes",
    pickId: pipe([
      tap(({ NetworkInsightsAccessScopeId }) => {
        assert(NetworkInsightsAccessScopeId);
      }),
      ({ NetworkInsightsAccessScopeId }) => ({
        NetworkInsightsAccessScopeIds: [NetworkInsightsAccessScopeId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInsightsAccessScopes-property
  getList: {
    method: "describeNetworkInsightsAccessScopes",
    getParam: "NetworkInsightsAccessScopes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkInsightsAccessScope-property
  create: {
    method: "createNetworkInsightsAccessScope",
    pickCreated: ({ payload }) => pipe([get("NetworkInsightsAccessScope")]),
  },
  // TODO No update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNetworkInsightsAccessScope-property
  destroy: {
    method: "deleteNetworkInsightsAccessScope",
    pickId: pipe([pick(["NetworkInsightsAccessScopeId"])]),
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
            ResourceType: "network-insights-access-scope",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
