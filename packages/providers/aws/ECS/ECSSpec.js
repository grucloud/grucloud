const { assign, map, pipe, get, omit } = require("rubico");

const { isOurMinionFactory } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { ECSCluster } = require("./ECSCluster");
const { ECSCapacityProvider } = require("./ECSCapacityProvider");
const { ECSService } = require("./ECSService");
const { ECSTaskSet } = require("./ECSTaskSet");
const { ECSTaskDefinition } = require("./ECSTaskDefinition");
const { ECSTask } = require("./ECSTask");
const { ECSContainerInstance } = require("./ECSContainerInstance");

const GROUP = "ECS";

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: "tags",
});

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "CapacityProvider",
      dependsOn: ["AutoScaling::AutoScalingGroup"],
      Client: ECSCapacityProvider,
      isOurMinion,
    },
    {
      type: "Cluster",
      dependsOn: ["ECS::CapacityProvider", "EC2::Instance"],
      Client: ECSCluster,
      isOurMinion,
    },
    {
      type: "TaskDefinition",
      dependsOn: ["IAM::Role"],
      Client: ECSTaskDefinition,
      isOurMinion,
    },
    {
      type: "Service",
      dependsOn: ["ECS::Cluster", "ECS::TaskDefinition"],
      Client: ECSService,
      isOurMinion,
      compare: compare({
        filterLive: pipe([
          assign({ cluster: get("clusterArn") }),
          omit([
            "clusterArn",
            "createdAt",
            "events",
            "deployments",
            "runningCount",
            "pendingCount",
            "status",
          ]),
        ]),
      }),
    },
    {
      type: "TaskSet",
      dependsOn: ["ECS::Cluster", "ECS::Service"],
      Client: ECSTaskSet,
      isOurMinion,
    },
    {
      type: "Task",
      dependsOn: [
        "ECS::Cluster",
        "ECS::TaskDefinition",
        "ECS::Service",
        "EC2::subnet",
        "EC2::securityGroup",
      ],
      Client: ECSTask,
      isOurMinion,
    },
    {
      type: "ContainerInstance",
      dependsOn: ["ECS::Cluster"],
      Client: ECSContainerInstance,
      isOurMinion,
    },
  ]);
