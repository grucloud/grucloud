---
id: DeploymentStrategy
title: Deployment Strategy
---

Manages an [AppConfig Deployment Strategy](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DeploymentStrategy",
    group: "AppConfig",
    properties: ({}) => ({
      DeploymentDurationInMinutes: 10,
      Description: "Strategy linear 20",
      FinalBakeTimeInMinutes: 10,
      GrowthFactor: 20,
      GrowthType: "LINEAR",
      Name: "my-stategy",
      ReplicateTo: "NONE",
    }),
  },
];
```

## Properties

- [CreateDeploymentStrategyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/createdeploymentstrategycommandinput.html)

## Used By

- [AppConfig Deployment](./Deployment.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::DeploymentStrategy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 4 AppConfig::DeploymentStrategy from aws                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ name: AppConfig.AllAtOnce                                                │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   DeploymentDurationInMinutes: 0                                         │
│   Description: Quick                                                     │
│   FinalBakeTimeInMinutes: 10                                             │
│   GrowthFactor: 100                                                      │
│   GrowthType: LINEAR                                                     │
│   Id: AppConfig.AllAtOnce                                                │
│   Name: AppConfig.AllAtOnce                                              │
│   ReplicateTo: NONE                                                      │
│   Tags:                                                                  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: AppConfig.Canary10Percent20Minutes                                 │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   DeploymentDurationInMinutes: 20                                        │
│   Description: AWS Recommended                                           │
│   FinalBakeTimeInMinutes: 10                                             │
│   GrowthFactor: 10                                                       │
│   GrowthType: EXPONENTIAL                                                │
│   Id: AppConfig.Canary10Percent20Minutes                                 │
│   Name: AppConfig.Canary10Percent20Minutes                               │
│   ReplicateTo: NONE                                                      │
│   Tags:                                                                  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: AppConfig.Linear50PercentEvery30Seconds                            │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   DeploymentDurationInMinutes: 1                                         │
│   Description: Test/Demo                                                 │
│   FinalBakeTimeInMinutes: 1                                              │
│   GrowthFactor: 50                                                       │
│   GrowthType: LINEAR                                                     │
│   Id: AppConfig.Linear50PercentEvery30Seconds                            │
│   Name: AppConfig.Linear50PercentEvery30Seconds                          │
│   ReplicateTo: NONE                                                      │
│   Tags:                                                                  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-stategy                                                         │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   DeploymentDurationInMinutes: 10                                        │
│   Description: Strategy linear 20                                        │
│   FinalBakeTimeInMinutes: 10                                             │
│   GrowthFactor: 20                                                       │
│   GrowthType: LINEAR                                                     │
│   Id: 0bqmf26                                                            │
│   Name: my-stategy                                                       │
│   ReplicateTo: NONE                                                      │
│   Tags:                                                                  │
│     Name: my-stategy                                                     │
│     gc-created-by-provider: aws                                          │
│     gc-managed-by: grucloud                                              │
│     gc-project-name: appconfig-simple                                    │
│     gc-stage: dev                                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────────────┬─────────────────────────────────────────┤
│ AppConfig::DeploymentStrategy │ AppConfig.AllAtOnce                     │
│                               │ AppConfig.Canary10Percent20Minutes      │
│                               │ AppConfig.Linear50PercentEvery30Seconds │
│                               │ my-stategy                              │
└───────────────────────────────┴─────────────────────────────────────────┘
4 resources, 1 type, 1 provider
Command "gc l -t AppConfig::DeploymentStrategy" executed in 3s, 101 MB
```
