const { assign, map, pipe, get, omit, pick, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { compareAws, isOurMinionFactory } = require("../AwsCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { ECSCluster } = require("./ECSCluster");
const { ECSCapacityProvider } = require("./ECSCapacityProvider");
const { ECSService } = require("./ECSService");
const { ECSTaskSet } = require("./ECSTaskSet");
const { ECSTaskDefinition } = require("./ECSTaskDefinition");
const { ECSTask } = require("./ECSTask");
const { ECSContainerInstance } = require("./ECSContainerInstance");

const GROUP = "ECS";
const tagsKey = "tags";

const compareECS = compareAws({ tagsKey, key: "key" });

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: tagsKey,
});

module.exports = pipe([
  () => [
    {
      type: "CapacityProvider",
      Client: ECSCapacityProvider,
      omitProperties: [
        "capacityProviderArn",
        "status",
        "updateStatus",
        "autoScalingGroupProvider.autoScalingGroupArn",
      ],
      compare: compareECS({}),
      filterLive: () =>
        pipe([
          pick(["autoScalingGroupProvider"]),
          omit(["autoScalingGroupProvider.autoScalingGroupArn"]),
        ]),
      dependencies: {
        autoScalingGroup: { type: "AutoScalingGroup", group: "AutoScaling" },
      },
    },
    {
      type: "Cluster",
      Client: ECSCluster,
      omitProperties: [
        "clusterArn",
        "status",
        "registeredContainerInstancesCount",
        "runningTasksCount",
        "pendingTasksCount",
        "activeServicesCount",
        "statistics",
        "attachments",
        "attachmentsStatus",
      ],
      propertiesDefault: { defaultCapacityProviderStrategy: [] },
      compare: compareECS({}),
      filterLive: () =>
        pipe([pick(["settings", "defaultCapacityProviderStrategy"])]),
      dependencies: {
        capacityProviders: {
          type: "CapacityProvider",
          group: "ECS",
          list: true,
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
        },
      },
    },
    {
      type: "TaskDefinition",
      dependencies: {
        role: { type: "Role", group: "IAM" },
      },
      Client: ECSTaskDefinition,
      compare: compareECS({
        filterLive: () =>
          pipe([
            omit([
              "taskDefinitionArn",
              "revision",
              "status",
              "compatibilities",
              "registeredAt",
              "registeredBy",
            ]),
            omitIfEmpty(["volumes"]),
          ]),
      }),
      filterLive: () =>
        pick([
          "containerDefinitions",
          "placementConstraints",
          "requiresCompatibilities",
        ]),
    },
    {
      type: "Service",
      Client: ECSService,
      omitProperties: [
        "taskDefinition",
        "clusterArn",
        "createdAt",
        "events",
        "deployments",
        "runningCount",
        "pendingCount",
        "status",
        "serviceArn",
        "createdBy",
      ],
      propertiesDefault: { propagateTags: "NONE" },
      compare: compareECS({
        filterLive: () =>
          pipe([
            assign({ cluster: get("clusterArn") }),
            omitIfEmpty(["loadBalancers", "serviceRegistries"]),
          ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "launchType",
            "desiredCount",
            "deploymentConfiguration",
            "placementConstraints",
            "placementStrategy",
            "schedulingStrategy",
            "enableECSManagedTags",
            "propagateTags",
            "enableExecuteCommand",
          ]),
          when(eq(get("propagateTags"), "NONE"), omit(["propagateTags"])),
        ]),
      dependencies: {
        cluster: { type: "Cluster", group: "ECS", parent: true },
        taskDefinition: { type: "TaskDefinition", group: "ECS" },
        loadBalancers: { type: "LoadBalancer", group: "ELBv2", list: true },
      },
    },
    {
      type: "TaskSet",
      dependencies: {
        cluster: { type: "Cluster", group: "ECS" },
        service: { type: "Service", group: "ECS", parent: true },
      },
      Client: ECSTaskSet,
      compare: compareECS({}),
    },
    {
      type: "Task",
      Client: ECSTask,
      compare: compareECS({}),
      filterLive: () =>
        pick(["enableExecuteCommand", "launchType", "overrides"]),
      dependencies: {
        cluster: { type: "Cluster", group: "ECS", parent: true },
        taskDefinition: { type: "TaskDefinition", group: "ECS" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
      },
    },
    {
      type: "ContainerInstance",
      dependencies: {
        cluster: { type: "Cluster", group: "ECS" },
      },
      Client: ECSContainerInstance,
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
