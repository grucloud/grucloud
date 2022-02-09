---
id: TaskDefinition
title: TaskDefinition
---

Manages an [ECS Task Definition](https://console.aws.amazon.com/ecs/home?#/taskDefinitions).

## Sample code

```js
exports.createResources = () => [
  {
    type: "TaskDefinition",
    group: "ECS",
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
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#registerTaskDefinition-property)

## Used By

- [Service](./Service.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecs/ecs-simple)

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
