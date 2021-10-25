const createResources = ({ provider }) => {
  provider.ECS.makeCluster({
    name: "cluster",
    properties: () => ({
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      capacityProviders: [resources.ECS.CapacityProvider["cp"]],
    }),
  });

  provider.ECS.makeCapacityProvider({
    name: "cp",
    properties: () => ({
      autoScalingGroupProvider: {
        managedScaling: {
          status: "ENABLED",
          targetCapacity: 90,
          minimumScalingStepSize: 1,
          maximumScalingStepSize: 10000,
          instanceWarmupPeriod: 300,
        },
        managedTerminationProtection: "DISABLED",
      },
    }),
    dependencies: ({ resources }) => ({
      autoScalingGroup:
        resources.AutoScaling.AutoScalingGroup["EcsInstanceAsg"],
    }),
  });

  provider.ECS.makeTaskDefinition({
    name: "nginx",
    properties: () => ({
      containerDefinitions: [
        {
          name: "nginx",
          image: "nginx",
          cpu: 0,
          memory: 512,
          portMappings: [
            {
              containerPort: 81,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
          essential: true,
          environment: [],
          mountPoints: [],
          volumesFrom: [],
        },
      ],
      placementConstraints: [],
      requiresCompatibilities: ["EC2"],
    }),
  });

  provider.ECS.makeService({
    name: "service-nginx",
    properties: () => ({
      launchType: "EC2",
      desiredCount: 2,
      deploymentConfiguration: {
        deploymentCircuitBreaker: {
          enable: false,
          rollback: false,
        },
        maximumPercent: 200,
        minimumHealthyPercent: 100,
      },
      placementConstraints: [],
      placementStrategy: [
        {
          type: "spread",
          field: "attribute:ecs.availability-zone",
        },
        {
          type: "spread",
          field: "instanceId",
        },
      ],
      schedulingStrategy: "REPLICA",
      enableECSManagedTags: true,
      enableExecuteCommand: false,
    }),
    dependencies: ({ resources }) => ({
      cluster: resources.ECS.Cluster["cluster"],
      taskDefinition: resources.ECS.TaskDefinition["nginx"],
    }),
  });
};

exports.createResources = createResources;
