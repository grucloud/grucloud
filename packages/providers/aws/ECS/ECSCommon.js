const { pipe, tap } = require("rubico");
const { buildTags } = require("../AwsCommon");

const { ECS } = require("@aws-sdk/client-ecs");
const { createEndpoint } = require("../AwsCommon");

exports.createECS = createEndpoint(ECS);

exports.buildTagsEcs = ({ name, config, namespace, Tags }) =>
  buildTags({
    name,
    config,
    namespace,
    UserTags: Tags,
    key: "key",
    value: "value",
  });

exports.findDependenciesCluster = ({ live }) => ({
  type: "Cluster",
  group: "ECS",
  ids: [live.clusterArn],
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#tagResource-property
exports.tagResource =
  ({ ecs }) =>
  ({ id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), ecs().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#untagResource-property
exports.untagResource =
  ({ ecs }) =>
  ({ id }) =>
    pipe([(tagKeys) => ({ resourceArn: id, tagKeys }), ecs().untagResource]);
