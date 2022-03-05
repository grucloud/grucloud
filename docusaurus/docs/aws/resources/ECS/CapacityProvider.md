---
id: CapacityProvider
title: CapacityProvider
---

Manages an [ECS Capacity Provider](https://console.aws.amazon.com/ecs/home?#/clusters).

## Sample code

```js
exports.createResources = () => [
  {
    type: "CapacityProvider",
    group: "ECS",
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
    dependencies: () => ({
      autoScalingGroup: "EcsInstanceAsg",
    }),
  },
];
```

## Properties

- [CreateCapacityProviderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ecs/interfaces/createcapacityprovidercommandinput.html)

## Dependencies

- [AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)

## Used By

- [ECS Cluster](./Cluster.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple)

## List

The capacity providers can be filtered with the _CapacityProvider_ type:

```sh
gc l -t CapacityProvider
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 19/19
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 3 ECS::CapacityProvider from aws                                                     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: cp                                                                             │
│ managedByUs: Yes                                                                     │
│ live:                                                                                │
│   capacityProviderArn: arn:aws:ecs:eu-west-2:840541460064:capacity-provider/cp       │
│   name: cp                                                                           │
│   status: ACTIVE                                                                     │
│   autoScalingGroupProvider:                                                          │
│     autoScalingGroupArn: arn:aws:autoscaling:eu-west-2:840541460064:autoScalingGrou… │
│     managedScaling:                                                                  │
│       status: ENABLED                                                                │
│       targetCapacity: 100                                                            │
│       minimumScalingStepSize: 1                                                      │
│       maximumScalingStepSize: 10000                                                  │
│       instanceWarmupPeriod: 300                                                      │
│     managedTerminationProtection: DISABLED                                           │
│   tags:                                                                              │
│     - key: gc-created-by-provider                                                    │
│       value: aws                                                                     │
│     - key: gc-managed-by                                                             │
│       value: grucloud                                                                │
│     - key: gc-project-name                                                           │
│       value: example-grucloud-ecs-simple                                             │
│     - key: gc-stage                                                                  │
│       value: dev                                                                     │
│     - key: Name                                                                      │
│       value: cp                                                                      │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: FARGATE                                                                        │
│ managedByUs: NO                                                                      │
│ live:                                                                                │
│   capacityProviderArn: arn:aws:ecs:eu-west-2:840541460064:capacity-provider/FARGATE  │
│   name: FARGATE                                                                      │
│   status: ACTIVE                                                                     │
│   tags: []                                                                           │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: FARGATE_SPOT                                                                   │
│ managedByUs: NO                                                                      │
│ live:                                                                                │
│   capacityProviderArn: arn:aws:ecs:eu-west-2:840541460064:capacity-provider/FARGATE… │
│   name: FARGATE_SPOT                                                                 │
│   status: ACTIVE                                                                     │
│   tags: []                                                                           │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────────────────┬────────────────────────────────────────────────┤
│ ECS::CapacityProvider          │ cp                                             │
│                                │ FARGATE                                        │
│                                │ FARGATE_SPOT                                   │
└────────────────────────────────┴────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t CapacityProvider" executed in 20s
```
