const assert = require("assert");
const { map, pipe, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

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

module.exports = pipe([
  () => [
    ECSCapacityProvider({ compare }),
    ECSCluster({ compare }),
    ECSService({ compare }),
    ECSTask({ compare }),
    ECSTaskDefinition({ compare }),
    // {
    //   type: "TaskSet",
    //   dependencies: {
    //     cluster: {
    //       type: "Cluster",
    //       group: "ECS",
    //       dependencyId: ({ lives, config }) => get("clusterArn"),
    //     },
    //     service: {
    //       type: "Service",
    //       group: "ECS",
    //       parent: true,
    //       dependencyId: ({ lives, config }) => get("serviceArn"),
    //     },
    //     taskDefinition: {
    //       type: "TaskDefinition",
    //       group: "ECS",
    //       dependencyId: ({ lives, config }) => get("taskDefinitionArn"),
    //     },
    //     targetGroups: dependencyTargetGroups,
    //   },
    //   Client: ECSTaskSet,
    // },
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
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, tagsKey, compare: compare({}) }),
    ])
  ),
]);
