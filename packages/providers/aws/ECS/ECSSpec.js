const { assign, map } = require("rubico");
const { isOurMinionFactory } = require("../AwsCommon");

const { ECSCluster } = require("./ECSCluster");
const { ECSCapacityProvider } = require("./ECSCapacityProvider");
const { ECSService } = require("./ECSService");
const { ECSTaskSet } = require("./ECSTaskSet");
const { ECSTaskDefinition } = require("./ECSTaskDefinition");
const { ECSTask } = require("./ECSTask");
const { ECSContainerInstance } = require("./ECSContainerInstance");

const GROUP = "ecs";

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: "tags",
});

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "CapacityProvider",
      dependsOn: ["autoscaling::AutoScalingGroup"],
      Client: ECSCapacityProvider,
      isOurMinion,
    },
    {
      type: "Cluster",
      dependsOn: ["ecs::CapacityProvider", "ec2::Instance"],
      Client: ECSCluster,
      isOurMinion,
    },
    {
      type: "TaskDefinition",
      dependsOn: ["iam::Role"],
      Client: ECSTaskDefinition,
      isOurMinion,
    },
    {
      type: "Service",
      dependsOn: ["ecs::Cluster", "ecs::TaskDefinition"],
      Client: ECSService,
      isOurMinion,
    },

    {
      type: "TaskSet",
      dependsOn: ["ecs::Cluster", "ecs::Service"],
      Client: ECSTaskSet,
      isOurMinion,
    },
    {
      type: "Task",
      dependsOn: [
        "ecs::Cluster",
        "ecs::TaskDefinition",
        "ec2::subnet",
        "ec2::securityGroup",
      ],
      Client: ECSTask,
      isOurMinion,
    },
    {
      type: "ContainerInstance",
      dependsOn: ["ecs::Cluster"],
      Client: ECSContainerInstance,
      isOurMinion,
    },
  ]);
