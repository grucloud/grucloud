const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./MSKCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("ClusterArn");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  pick(["ClusterArn"]),
]);

const model = ({ config }) => ({
  package: "kafka",
  client: "Kafka",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#describeClusterV2-property
  getById: {
    method: "describeClusterV2",
    pickId,
    getField: "ClusterInfo",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#listClustersV2-property
  getList: {
    method: "listClustersV2",
    getParam: "ClusterInfoList",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#createClusterV2-property
  create: {
    method: "createClusterV2",
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("State"), "ACTIVE"),
    isInstanceError: eq(get("State"), "FAILED"),
    getErrorMessage: get("StateInfo.Message", "failed"),
    // TODO retry on "Amazon MSK could not create your cluster because of a service issue. Retry the operation"
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#updateClusterConfiguration-property
  update: {
    method: "updateClusterConfiguration",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ClusterArn: live.ClusterArn })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
  },
});

exports.MSKClusterV2 = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ClusterName")]),
    findId: pipe([get("live.ClusterArn")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
