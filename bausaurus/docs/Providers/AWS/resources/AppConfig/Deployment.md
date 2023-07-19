---
id: Deployment
title: Deployment
---

Manages an [AppConfig Deployment](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Deployment",
    group: "AppConfig",
    dependencies: ({}) => ({
      configurationProfile: "my-appconfig::profile-freeform",
      deploymentStrategy: "my-stategy",
      environment: "my-appconfig::env-dev",
      hostedConfigurationVersion: "my-appconfig::profile-freeform",
    }),
  },
];
```

## Properties

- [StartDeploymentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/startdeploymentcommandinput.html)

## Dependencies

- [AppConfig Application](./Application.md)
- [AppConfig Configuration Profile](./ConfigurationProfile.md)
- [AppConfig Deployment Strategy](./DeploymentStrategy.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::Deployment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 AppConfig::Deployment from aws                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig::env-dev                                              │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ApplicationId: sy4ot8r                                                 │
│   AppliedExtensions: []                                                  │
│   ConfigurationLocationUri: hosted                                       │
│   ConfigurationName: profile-freeform                                    │
│   ConfigurationProfileId: due8kag                                        │
│   ConfigurationVersion: 1                                                │
│   DeploymentDurationInMinutes: 10                                        │
│   DeploymentNumber: 1                                                    │
│   DeploymentStrategyId: 0bqmf26                                          │
│   EnvironmentId: meclcn6                                                 │
│   EventLog:                                                              │
│     -                                                                    │
│       Description: Deployment started                                    │
│       EventType: DEPLOYMENT_STARTED                                      │
│       OccurredAt: 2022-10-15T16:57:47.386Z                               │
│       TriggeredBy: USER                                                  │
│   FinalBakeTimeInMinutes: 10                                             │
│   GrowthFactor: 20                                                       │
│   GrowthType: LINEAR                                                     │
│   PercentageComplete: 0                                                  │
│   StartedAt: 2022-10-15T16:57:47.386Z                                    │
│   State: DEPLOYING                                                       │
│   Tags:                                                                  │
│     Name: my-appconfig::env-dev                                          │
│     gc-created-by-provider: aws                                          │
│     gc-managed-by: grucloud                                              │
│     gc-project-name: appconfig-simple                                    │
│     gc-stage: dev                                                        │
│   Latest: true                                                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────┬─────────────────────────────────────────────────┤
│ AppConfig::Deployment │ my-appconfig::env-dev                           │
└───────────────────────┴─────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AppConfig::Deployment" executed in 6s, 94 MB
```
