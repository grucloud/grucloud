const assert = require("assert");
const {
  assign,
  map,
  pipe,
  get,
  omit,
  pick,
  eq,
  tap,
  switchCase,
} = require("rubico");
const { defaultsDeep, when, pluck, identity } = require("rubico/x");
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
const {
  ECSTaskDefinition,
  findDependenciesInEnvironment,
} = require("./ECSTaskDefinition");
const { ECSTask } = require("./ECSTask");

//const { ECSContainerInstance } = require("./ECSContainerInstance");

const GROUP = "ECS";
const tagsKey = "tags";

const compareECS = compareAws({ tagsKey, key: "key" });

const dependencyTargetGroups = {
  type: "TargetGroup",
  group: "ElasticLoadBalancingV2",
  list: true,
  dependencyIds: ({ lives, config }) =>
    pipe([get("loadBalancers"), pluck("targetGroupArn")]),
};

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
      inferName: get("properties.name"),
      omitProperties: [
        "capacityProviderArn",
        "status",
        "updateStatus",
        "autoScalingGroupProvider.autoScalingGroupArn",
      ],
      compare: compareECS({}),
      filterLive: () =>
        pipe([
          pick(["name", "autoScalingGroupProvider"]),
          omit(["autoScalingGroupProvider.autoScalingGroupArn"]),
        ]),
      dependencies: {
        autoScalingGroup: {
          type: "AutoScalingGroup",
          group: "AutoScaling",
          dependencyId: ({ lives, config }) =>
            get("autoScalingGroupProvider.autoScalingGroupArn"),
        },
      },
    },
    {
      type: "Cluster",
      Client: ECSCluster,
      inferName: get("properties.clusterName"),
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
        "configuration.executeCommandConfiguration.kmsKeyId",
      ],
      propertiesDefault: { defaultCapacityProviderStrategy: [] },
      compare: compareECS({}),
      filterLive: () =>
        pipe([
          pick(["clusterName", "settings", "defaultCapacityProviderStrategy"]),
        ]),
      dependencies: {
        capacityProviders: {
          type: "CapacityProvider",
          group: "ECS",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("capacityProviders"),
              map(
                pipe([
                  (name) =>
                    lives.getByName({
                      name,
                      type: "CapacityProvider",
                      group: "ECS",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])
              ),
            ]),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) =>
            get("configuration.executeCommandConfiguration.kmsKeyId"),
        },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) =>
            get(
              "configuration.executeCommandConfiguration.logConfiguration.s3BucketName"
            ),
        },
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: "CloudWatchLogs",
          dependencyId: ({ lives, config }) =>
            get(
              "configuration.executeCommandConfiguration.logConfiguration.cloudWatchLogGroupName"
            ),
        },
      },
    },
    {
      type: "TaskDefinition",
      Client: ECSTaskDefinition,
      inferName: get("properties.family"),
      dependencies: {
        taskRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("taskRoleArn"),
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
          dependencyId: ({ lives, config }) => get("executionRoleArn"),
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                eq(get("live.executionRoleArn"), dependency.live.Arn),
              ])(),
        },
        secret: {
          type: "Secret",
          group: "SecretsManager",
          dependencyId: findDependenciesInEnvironment({
            type: "Secret",
            group: "SecretsManager",
          }),
        },
        rdsDbCluster: {
          type: "DBCluster",
          group: "RDS",
          dependencyId: findDependenciesInEnvironment({
            type: "DBCluster",
            group: "RDS",
          }),
        },
      },
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
                    get("image"),
                    assign({
                      image: pipe([
                        get("image"),
                        replaceRegion({ providerConfig }),
                      ]),
                    })
                  ),
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
                                    replaceRegion({ providerConfig }),
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
                        value: pipe([
                          get("value"),
                          switchCase([
                            eq(identity, providerConfig.region),
                            replaceRegion({ providerConfig }),
                            replaceWithName({
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        ]),
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
      inferName: get("properties.serviceName"),
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
        "taskSets",
      ],
      propertiesDefault: {
        propagateTags: "NONE",
        deploymentController: { type: "ECS" },
      },
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
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            loadBalancers: pipe([
              get("loadBalancers"),
              map(
                pipe([
                  assign({
                    targetGroupArn: pipe([
                      get("targetGroupArn"),
                      replaceWithName({
                        groupType: "ElasticLoadBalancingV2::TargetGroup",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
          omitIfEmpty(["loadBalancers", "serviceRegistries"]),
          when(eq(get("propagateTags"), "NONE"), omit(["propagateTags"])),
        ]),
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
          dependencyId: ({ lives, config }) => get("taskDefinition"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("networkConfiguration.awsvpcConfiguration.subnets"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("networkConfiguration.awsvpcConfiguration.securityGroups"),
        },
        targetGroups: dependencyTargetGroups,
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
      compare: compareECS({}),
    },
    {
      type: "Task",
      Client: ECSTask,
      compare: compareECS({}),
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
