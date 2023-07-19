---
id: ConfigurationProfile
title: Configuration Profile
---

Manages an [AppConfig Configuration Profile](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ConfigurationProfile",
    group: "AppConfig",
    properties: ({}) => ({
      Description: "my configuration profile",
      LocationUri: "hosted",
      Name: "my-profile",
      Type: "AWS.AppConfig.FeatureFlags",
    }),
    dependencies: ({}) => ({
      application: "my-appconfig",
    }),
  },
];
```

## Properties

- [CreateConfigurationProfileCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/createconfigurationprofilecommandinput.html)

## Dependencies

- [AppConfig Application](./Application.md)
- [IAM Role](../IAM/Role.md)

# Used By

- [AppConfig Deployment](./Deployment.md)
- [AppConfig Extension Association](./ExtensionAssociation.md)
- [AppConfig Hosted Configuration Version](./HostedConfigurationVersion.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::ConfigurationProfile
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 AppConfig::ConfigurationProfile from aws                               │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig::my-profile                                           │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ApplicationId: sy4ot8r                                                 │
│   Id: 4jjepdu                                                            │
│   LocationUri: hosted                                                    │
│   Name: my-profile                                                       │
│   Type: AWS.AppConfig.FeatureFlags                                       │
│   Tags:                                                                  │
│     Name: my-appconfig::my-profile                                       │
│     gc-created-by-provider: aws                                          │
│     gc-managed-by: grucloud                                              │
│     gc-project-name: appconfig-simple                                    │
│     gc-stage: dev                                                        │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig::profile-freeform                                     │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ApplicationId: sy4ot8r                                                 │
│   Id: due8kag                                                            │
│   LocationUri: hosted                                                    │
│   Name: profile-freeform                                                 │
│   Type: AWS.Freeform                                                     │
│   Tags:                                                                  │
│     Name: my-appconfig::profile-freeform                                 │
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
├─────────────────────────────────┬───────────────────────────────────────┤
│ AppConfig::ConfigurationProfile │ my-appconfig::my-profile              │
│                                 │ my-appconfig::profile-freeform        │
└─────────────────────────────────┴───────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t AppConfig::ConfigurationProfile" executed in 6s, 103 MB
```
