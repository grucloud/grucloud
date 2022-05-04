const assert = require("assert");
const { assign, map, pipe, get, omit, pick, eq, tap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const {
  compareAws,
  isOurMinionFactory,
  replaceRegion,
} = require("../AwsCommon");
const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

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
        secret: { type: "Secret", group: "SecretsManager" },
        rdsDbCluster: { type: "DBCluster", group: "RDS" },
        taskRole: {
          type: "Role",
          group: "IAM",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.taskRoleArn"), dependency.live.Arn),
              ])(),
        },
        executionRole: {
          type: "Role",
          group: "IAM",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.executionRoleArn"), dependency.live.Arn),
              ])(),
        },
      },
      Client: ECSTaskDefinition,
      omitProperties: [
        "taskDefinitionArn",
        "taskRoleArn",
        "executionRoleArn",
        "revision",
        "status",
        "compatibilities",
        "registeredAt",
        "registeredBy",
        "compatibilities",
      ],
      compare: compareECS({
        filterAll: () =>
          pipe([omitIfEmpty(["volumes", "placementConstraints"])]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          omitIfEmpty(["volumes", "placementConstraints"]),
          assign({
            containerDefinitions: pipe([
              get("containerDefinitions"),
              map(
                pipe([
                  when(
                    get("logConfiguration"),
                    assign({
                      logConfiguration: pipe([
                        get("logConfiguration"),
                        when(
                          get("options"),
                          assign({
                            options: pipe([
                              get("options"),
                              when(
                                get("awslogs-region"),
                                assign({
                                  ["awslogs-region"]: pipe([
                                    get("awslogs-region"),
                                    replaceRegion(providerConfig),
                                  ]),
                                })
                              ),
                            ]),
                          })
                        ),
                      ]),
                    })
                  ),
                ])
              ),
              map(
                assign({
                  environment: pipe([
                    get("environment"),
                    map(
                      assign({
                        value: ({ value }) =>
                          pipe([
                            () => ({ Id: value, lives }),
                            replaceWithName({ path: "id" }),
                          ])(),
                      })
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    {
      type: "Service",
      Client: ECSService,
      omitProperties: [
        "taskDefinition",
        "clusterArn",
        "cluster",
        "createdAt",
        "events",
        "deployments",
        "runningCount",
        "pendingCount",
        "status",
        "serviceArn",
        "roleArn",
        "createdBy",
        "networkConfiguration.awsvpcConfiguration.securityGroups",
        "networkConfiguration.awsvpcConfiguration.subnets",
      ],
      propertiesDefault: { propagateTags: "NONE" },
      compare: compareECS({
        filterAll: () =>
          pipe([
            assign({
              cluster: get("clusterArn"),
            }),
            assign({
              loadBalancers: pipe([
                get("loadBalancers"),
                map(omit(["targetGroupArn"])),
              ]),
            }),
            omitIfEmpty(["loadBalancers", "serviceRegistries"]),
          ]),
      }),
      filterLive: ({ lives }) =>
        pipe([
          assign({
            loadBalancers: pipe([
              get("loadBalancers"),
              map(
                pipe([
                  assign({
                    targetGroupArn: ({ targetGroupArn }) =>
                      pipe([
                        () => ({ Id: targetGroupArn, lives }),
                        replaceWithName({
                          groupType: "ELBv2::TargetGroup",
                          path: "id",
                        }),
                      ])(),
                  }),
                ])
              ),
            ]),
          }),
          omitIfEmpty(["loadBalancers", "serviceRegistries"]),
          when(eq(get("propagateTags"), "NONE"), omit(["propagateTags"])),
        ]),
      dependencies: {
        cluster: { type: "Cluster", group: "ECS", parent: true },
        taskDefinition: { type: "TaskDefinition", group: "ECS" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        loadBalancers: { type: "LoadBalancer", group: "ELBv2", list: true },
        targetGroups: { type: "TargetGroup", group: "ELBv2", list: true },
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
