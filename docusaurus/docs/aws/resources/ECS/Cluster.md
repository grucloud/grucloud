---
id: Cluster
title: Cluster
---

Manages an [ECS Cluster](https://console.aws.amazon.com/ecs/home?#/clusters).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Cluster",
    group: "ECS",
    name: "cluster",
    properties: () => ({
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
    dependencies: () => ({
      capacityProviders: ["cp"],
    }),
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCluster-property)

## Dependencies

- [Capacity Provider](./CapacityProvider.md)
- [KMS Key](../KMS/Key.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple)

## List

The clusters can be filtered with the _ECS::Cluster_ type:

```sh
gc l -t ECS::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 23/23
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1 ECS::Cluster from aws                                                       │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: cluster                                                                 │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   clusterArn: arn:aws:ecs:eu-west-2:840541460064:cluster/cluster              │
│   clusterName: cluster                                                        │
│   status: ACTIVE                                                              │
│   registeredContainerInstancesCount: 1                                        │
│   runningTasksCount: 1                                                        │
│   pendingTasksCount: 0                                                        │
│   activeServicesCount: 1                                                      │
│   statistics:                                                                 │
│     - name: runningEC2TasksCount                                              │
│       value: 1                                                                │
│     - name: runningFargateTasksCount                                          │
│       value: 0                                                                │
│     - name: pendingEC2TasksCount                                              │
│       value: 0                                                                │
│     - name: pendingFargateTasksCount                                          │
│       value: 0                                                                │
│     - name: runningExternalTasksCount                                         │
│       value: 0                                                                │
│     - name: pendingExternalTasksCount                                         │
│       value: 0                                                                │
│     - name: activeEC2ServiceCount                                             │
│       value: 1                                                                │
│     - name: activeFargateServiceCount                                         │
│       value: 0                                                                │
│     - name: drainingEC2ServiceCount                                           │
│       value: 0                                                                │
│     - name: drainingFargateServiceCount                                       │
│       value: 0                                                                │
│     - name: activeExternalServiceCount                                        │
│       value: 0                                                                │
│     - name: drainingExternalServiceCount                                      │
│       value: 0                                                                │
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
│       value: cluster                                                          │
│   settings:                                                                   │
│     - name: containerInsights                                                 │
│       value: enabled                                                          │
│   capacityProviders:                                                          │
│     - "cp"                                                                    │
│   defaultCapacityProviderStrategy: []                                         │
│   attachments:                                                                │
│     - id: 8c350eb4-7aa6-4881-8336-54abaeb534c1                                │
│       type: asp                                                               │
│       status: CREATED                                                         │
│       details:                                                                │
│         - name: capacityProviderName                                          │
│           value: cp                                                           │
│         - name: scalingPlanName                                               │
│           value: ECSManagedAutoScalingPlan-3124ced1-b8c9-4225-bd28-0df041bed… │
│   attachmentsStatus: UPDATE_COMPLETE                                          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────────────────┬─────────────────────────────────────────┤
│ ECS::Cluster                   │ cluster                                 │
└────────────────────────────────┴─────────────────────────────────────────┘
1 resource, 1 type, 1 provider
```
