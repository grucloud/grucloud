const { assign, map } = require("rubico");
const { isOurMinionFactory } = require("../AwsCommon");

const { ECSCluster } = require("./ECSCluster");

const GROUP = "ecs";

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: "tags",
});

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Cluster",
      Client: ECSCluster,
      isOurMinion,
    },
  ]);
