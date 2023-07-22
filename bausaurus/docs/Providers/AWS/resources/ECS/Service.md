---
id: Service
title: Service
---

Manages an [ECS Service](https://console.aws.amazon.com/ecs/home?#/clusters).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Service",
    group: "ECS",
    properties: () => ({
      serviceName: "service-nginx",
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
    dependencies: () => ({
      cluster: "cluster",
      taskDefinition: "nginx",
    }),
  },
];
```

## Properties

- [CreateServiceCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/createservicecommandinput.html)

## Dependencies

- [Cluster](./Cluster.md)
- [TaskDefinition](./TaskDefinition.md)
- [ElasticLoadBalancingV2 TargetGroup](../ElasticLoadBalancingV2/TargetGroup.md)
- [Security Group](../EC2/SecurityGroup.md)
- [Subnet](../EC2/Subnet.md)

## Used By

- [ApplicationAutoScaling Target](../ApplicationAutoScaling/Target.md)
- [CodeDeploy DeploymentGroup](../CodeDeploy/DeploymentGroup.md)
- [ECS TaskSet](./TaskSet.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple)
- [aws-cdk-examples/application-load-balancer-fargate-service]((https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service)

- [serverless-patterns/apigw-fargate-cdk]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk)

- [serverless-patterns/apigw-vpclink-pvt-alb]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)

- [serverless-patterns/fargate-aurora-serverless-cdk]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)

- [serverless-patterns/fargate-eventbridge]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge)

## List

The ECS services can be filtered with the _Service_ type:

```sh
gc l -t ECS::Service
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 25/25
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1 ECS::Service from aws                                                       │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: service-nginx                                                           │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   serviceArn: arn:aws:ecs:eu-west-2:840541460064:service/cluster/service-ngi… │
│   serviceName: service-nginx                                                  │
│   clusterArn: arn:aws:ecs:eu-west-2:840541460064:cluster/cluster              │
│   loadBalancers: []                                                           │
│   serviceRegistries: []                                                       │
│   status: ACTIVE                                                              │
│   desiredCount: 1                                                             │
│   runningCount: 1                                                             │
│   pendingCount: 0                                                             │
│   launchType: EC2                                                             │
│   taskDefinition: arn:aws:ecs:eu-west-2:840541460064:task-definition/nginx:47 │
│   deploymentConfiguration:                                                    │
│     deploymentCircuitBreaker:                                                 │
│       enable: false                                                           │
│       rollback: false                                                         │
│     maximumPercent: 200                                                       │
│     minimumHealthyPercent: 100                                                │
│   deployments:                                                                │
│     - id: ecs-svc/7147023744074056707                                         │
│       status: PRIMARY                                                         │
│       taskDefinition: arn:aws:ecs:eu-west-2:840541460064:task-definition/ngi… │
│       desiredCount: 1                                                         │
│       pendingCount: 0                                                         │
│       runningCount: 1                                                         │
│       failedTasks: 0                                                          │
│       createdAt: 2021-09-03T13:41:13.681Z                                     │
│       updatedAt: 2021-09-03T13:42:33.232Z                                     │
│       launchType: EC2                                                         │
│       rolloutState: COMPLETED                                                 │
│       rolloutStateReason: ECS deployment ecs-svc/7147023744074056707 complet… │
│   events:                                                                     │
│     - id: 8d36c860-4f52-43e1-bf3a-5f47bbef71d4                                │
│       createdAt: 2021-09-03T13:42:33.240Z                                     │
│       message: (service service-nginx) has reached a steady state.            │
│     - id: b05415fd-18e6-484c-bf97-342f1259e925                                │
│       createdAt: 2021-09-03T13:42:33.239Z                                     │
│       message: (service service-nginx) (deployment ecs-svc/71470237440740567… │
│     - id: 17ca843b-e785-43c3-a4af-9b147f78dfa9                                │
│       createdAt: 2021-09-03T13:42:22.559Z                                     │
│       message: (service service-nginx) has started 1 tasks: (task c6cf491773… │
│     - id: 59a6478b-ca2f-4b1f-acf8-3ca8ceb1eaa5                                │
│       createdAt: 2021-09-03T13:41:21.065Z                                     │
│       message: (service service-nginx) was unable to place a task because no… │
│   createdAt: 2021-09-03T13:41:13.681Z                                         │
│   placementConstraints: []                                                    │
│   placementStrategy:                                                          │
│     - type: spread                                                            │
│       field: attribute:ecs.availability-zone                                  │
│     - type: spread                                                            │
│       field: instanceId                                                       │
│   schedulingStrategy: REPLICA                                                 │
│   tags:                                                                       │
│     - key: gc-created-by-provider                                             │
│       value: aws                                                              │
│     - key: gc-managed-by                                                      │
│       value: grucloud                                                         │
│     - key: gc-project-name                                                    │
│       value: example-grucloud-ecs-simple                                      │
│     - key: gc-stage                                                           │
│       value: dev                                                              │
│     - key: Name                                                               │
│       value: service-nginx                                                    │
│   createdBy: arn:aws:iam::840541460064:root                                   │
│   enableECSManagedTags: true                                                  │
│   propagateTags: NONE                                                         │
│   enableExecuteCommand: false                                                 │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────────────────┬─────────────────────────────────────────┤
│ ECS::Service                   │ service-nginx                           │
└────────────────────────────────┴─────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Service" executed in 15s
```
