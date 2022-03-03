const { buildTags } = require("../AwsCommon");

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
