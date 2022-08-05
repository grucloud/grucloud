---
id: TaskDefinition
title: Task Definition
---

Manages an [ECS Task Definition](https://console.aws.amazon.com/ecs/home?#/taskDefinitions).

## Sample code

```js
exports.createResources = () => [
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          command: [],
          cpu: 0,
          dnsSearchDomains: [],
          dnsServers: [],
          dockerLabels: {},
          dockerSecurityOptions: [],
          entryPoint: [],
          environment: [],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image: "amazon/amazon-ecs-sample",
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "ECSServiceStack-amazonecssampleTaskDefwebLogGroup910AB31A-Aka75VsMnKfI",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "ECSServiceStack",
            },
            secretOptions: [],
          },
          mountPoints: [],
          name: "web",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
          secrets: [],
          systemControls: [],
          ulimits: [],
          volumesFrom: [],
        },
      ],
      cpu: "512",
      family: "ECSServiceStackamazonecssampleTaskDef499685C5",
      memory: "1024",
      networkMode: "awsvpc",
      requiresAttributes: [
        {
          name: "com.amazonaws.ecs.capability.logging-driver.awslogs",
        },
        {
          name: "ecs.capability.execution-role-awslogs",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.19",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.17",
        },
        {
          name: "com.amazonaws.ecs.capability.task-iam-role",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.18",
        },
        {
          name: "ecs.capability.task-eni",
        },
      ],
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: ({}) => ({
      taskRole:
        "ECSServiceStack-amazonecssampleTaskDefTaskRole527D-1JLMLL2357T0V",
      executionRole:
        "ECSServiceStack-amazonecssampleTaskDefExecutionRol-1391KZSJLULK2",
    }),
  },
];
```

## Properties

- [RegisterTaskDefinitionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/registertaskdefinitioncommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)
- [RDS DBCluster](../RDS/DBCluster.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

## Used By

- [ECS Service](./Service.md)
- [ECS TaskSet](./TaskSet.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple)

- [aws-cdk-examples/application-load-balancer-fargate-service]((https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-cdk-examples/application-load-balancer-fargate-service)

- [serverless-patterns/apigw-fargate-cdk]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-fargate-cdk)

- [serverless-patterns/apigw-vpclink-pvt-alb]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-vpclink-pvt-alb)

- [serverless-patterns/fargate-aurora-serverless-cdk]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)

- [serverless-patterns/fargate-eventbridge]((https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-eventbridge)

## List

The ECS services can be filtered with the _TaskDefinition_ type:

```sh
gc l -t TaskDefinition
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1 ECS::TaskDefinition from aws                                                │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: nginx                                                                   │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   taskDefinitionArn: arn:aws:ecs:eu-west-2:840541460064:task-definition/ngin… │
│   containerDefinitions:                                                       │
│     - name: nginx                                                             │
│       image: nginx                                                            │
│       cpu: 0                                                                  │
│       memory: 512                                                             │
│       portMappings:                                                           │
│         - containerPort: 80                                                   │
│           hostPort: 80                                                        │
│           protocol: tcp                                                       │
│       essential: true                                                         │
│       environment: []                                                         │
│       mountPoints: []                                                         │
│       volumesFrom: []                                                         │
│   family: nginx                                                               │
│   revision: 47                                                                │
│   volumes: []                                                                 │
│   status: ACTIVE                                                              │
│   placementConstraints: []                                                    │
│   compatibilities:                                                            │
│     - "EXTERNAL"                                                              │
│     - "EC2"                                                                   │
│   requiresCompatibilities:                                                    │
│     - "EC2"                                                                   │
│   registeredAt: 2021-09-03T13:40:50.297Z                                      │
│   registeredBy: arn:aws:iam::840541460064:root                                │
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
│       value: nginx                                                            │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────────────────┬─────────────────────────────────────────┤
│ ECS::TaskDefinition            │ nginx                                   │
└────────────────────────────────┴─────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t TaskDefinition" executed in 6s
```
