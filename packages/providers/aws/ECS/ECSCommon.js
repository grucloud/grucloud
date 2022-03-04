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
