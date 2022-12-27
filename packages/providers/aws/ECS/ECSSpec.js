const assert = require("assert");
const { map, pipe, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws, isOurMinionFactory } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { dependencyTargetGroups } = require("./ECSCommon");

const { ECSCluster } = require("./ECSCluster");
const { ECSCapacityProvider } = require("./ECSCapacityProvider");
const { ECSService } = require("./ECSService");
const { ECSTaskSet } = require("./ECSTaskSet");
const { ECSTaskDefinition } = require("./ECSTaskDefinition");
const { ECSTask } = require("./ECSTask");

//const { ECSContainerInstance } = require("./ECSContainerInstance");

const GROUP = "ECS";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: tagsKey,
});

module.exports = pipe([
  () => [
    createAwsService(ECSCapacityProvider({ compare })),
    createAwsService(ECSCluster({ compare })),
    createAwsService(ECSService({ compare })),
    createAwsService(ECSTaskDefinition({ compare })),
    {
      type: "Task",
      Client: ECSTask,
      compare: compare({}),
      filterLive: () =>
        pick(["enableExecuteCommand", "launchType", "overrides"]),
      dependencies: {
        cluster: {
          type: "Cluster",
          group: "ECS",
          parent: true,
          dependencyId: ({ lives, config }) => get("clusterArn"),
        },
        taskDefinition: {
          type: "TaskDefinition",
          group: "ECS",
          dependencyId: ({ lives, config }) => get("taskDefinitionArn"),
        },
      },
    },
    {
      type: "TaskSet",
      dependencies: {
        cluster: {
          type: "Cluster",
          group: "ECS",
          dependencyId: ({ lives, config }) => get("clusterArn"),
        },
        service: {
          type: "Service",
          group: "ECS",
          parent: true,
          dependencyId: ({ lives, config }) => get("serviceArn"),
        },
        taskDefinition: {
          type: "TaskDefinition",
          group: "ECS",
          dependencyId: ({ lives, config }) => get("taskDefinitionArn"),
        },
        targetGroups: dependencyTargetGroups,
      },
      Client: ECSTaskSet,
      compare: compare({}),
    },

    // {
    //   type: "ContainerInstance",
    //   dependencies: {
    //     cluster: {
    //       type: "Cluster",
    //       group: "ECS",
    //       parent: true,
    //       dependencyId: ({ lives, config }) => get("clusterArn"),
    //     },
    //   },
    //   Client: ECSContainerInstance,
    // },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
