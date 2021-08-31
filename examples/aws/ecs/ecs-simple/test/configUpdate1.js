module.exports = ({ stage }) => ({
  projectName: "example-grucloud-ecs-simple",
  ECS: {
    Cluster: {
      cluster: {
        name: "cluster",
        properties: {
          settings: [
            {
              name: "containerInsights",
              value: "disabled",
            },
          ],
          defaultCapacityProviderStrategy: [],
        },
      },
    },
    CapacityProvider: {
      cp: {
        name: "cp",
        properties: {
          autoScalingGroupProvider: {
            managedScaling: {
              status: "ENABLED",
              targetCapacity: 100,
              minimumScalingStepSize: 1,
              maximumScalingStepSize: 10000,
              instanceWarmupPeriod: 300,
            },
            managedTerminationProtection: "DISABLED",
          },
        },
      },
    },
    TaskDefinition: {
      nginx: {
        name: "nginx",
        properties: {
          containerDefinitions: [
            {
              name: "nginx",
              image: "nginx",
              cpu: 0,
              memory: 512,
              portMappings: [
                {
                  containerPort: 80,
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
        },
      },
    },
    Service: {
      serviceNginx: {
        name: "service-nginx",
        properties: {
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
        },
      },
    },
  },
});
