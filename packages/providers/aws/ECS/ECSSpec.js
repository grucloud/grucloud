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

const isOurMinion = isOurMinionFactory({
  key: "key",
  value: "value",
  tags: "tags",
});

const filterTargetDefault = pipe([omit(["tags"])]);
const filterLiveDefault = pipe([omit(["tags"])]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "CapacityProvider",
      Client: ECSCapacityProvider,
      isOurMinion,
      compare: compareAws({
        filterAll: pipe([omit(["tags"])]),
        filterLive: () =>
          pipe([
            omit(["capacityProviderArn", "status", "updateStatus"]),
            filterLiveDefault,
          ]),
      }),
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
      isOurMinion,
      compare: compareAws({
        filterTarget: () =>
          pipe([
            defaultsDeep({ defaultCapacityProviderStrategy: [] }),
            filterTargetDefault,
          ]),
        filterLive: () =>
          pipe([
            omit([
              "clusterArn",
              "status",
              "registeredContainerInstancesCount",
              "runningTasksCount",
              "pendingTasksCount",
              "activeServicesCount",
              "statistics",
              "attachments",
              "attachmentsStatus",
            ]),
            filterLiveDefault,
          ]),
      }),
      filterLive: () =>
        pipe([
          pick(["settings", "defaultCapacityProviderStrategy"]),
          omitIfEmpty(["defaultCapacityProviderStrategy"]),
        ]),
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
      isOurMinion,
      compare: compareAws({
        filterTarget: () => pipe([omit([""]), filterTargetDefault]),
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
            filterLiveDefault,
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
      isOurMinion,
      compare: compareAws({
        filterTarget: () =>
          pipe([
            defaultsDeep({ propagateTags: "NONE" }),
            omit(["taskDefinition"]),
            filterTargetDefault,
          ]),
        filterLive: () =>
          pipe([
            assign({ cluster: get("clusterArn") }),
            omit([
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
            ]),
            omitIfEmpty(["loadBalancers", "serviceRegistries"]),
            filterLiveDefault,
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
      isOurMinion,
      compare: compareAws({
        filterTarget: () => pipe([omit([""]), filterTargetDefault]),
        filterLive: () => pipe([omit([""]), filterLiveDefault]),
      }),
    },
    {
      type: "Task",
      Client: ECSTask,
      isOurMinion,
      compare: compareAws({
        filterTarget: () => pipe([omit([""]), filterTargetDefault]),
        filterLive: () => pipe([omit([""]), filterLiveDefault]),
      }),
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
      isOurMinion,
    },
  ]);
