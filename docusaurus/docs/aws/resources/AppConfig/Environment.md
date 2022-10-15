---
id: Environment
title: Environment
---

Manages an [AppConfig Environment](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Environment",
    group: "AppConfig",
    properties: ({}) => ({
      Description: "dev",
      Name: "env-dev",
    }),
    dependencies: ({}) => ({
      application: "my-appconfig",
    }),
  },
];
```

## Properties

- [CreateEnvironmentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/createenvironmentcommandinput.html)

## Dependencies

- [AppConfig Application](./Application.md)
- [CloudWatch Metric Alarm](../CloudWatch/MetricAlarm.md)
- [IAM Role](../IAM/Role.md)

## Used By

- [AppConfig Extension Association](./ExtensionAssociation.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::Environment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 AppConfig::Environment from aws                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig::env-dev                                              │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ApplicationId: sy4ot8r                                                 │
│   Description: dev                                                       │
│   Id: meclcn6                                                            │
│   Monitors: []                                                           │
│   Name: env-dev                                                          │
│   State: Deploying                                                       │
│   Tags:                                                                  │
│     Name: my-appconfig::env-dev                                          │
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
├────────────────────────┬────────────────────────────────────────────────┤
│ AppConfig::Environment │ my-appconfig::env-dev                          │
└────────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AppConfig::Environment" executed in 4s, 103 MB
```
