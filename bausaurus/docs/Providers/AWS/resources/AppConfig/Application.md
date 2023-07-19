---
id: Application
title: Application
---

Manages an [AppConfig Application](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Application",
    group: "AppConfig",
    properties: ({}) => ({
      Description: "My App Config",
      Name: "my-appconfig",
    }),
  },
];
```

## Properties

- [CreateApplicationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/createapplicationcommandinput.html)

## Used By

- [AppConfig Configuration Profile](./ConfigurationProfile.md)
- [AppConfig Deployment](./Deployment.md)
- [AppConfig Extension Association](./ExtensionAssociation.md)
- [AppConfig Hosted Configuration Version](./HostedConfigurationVersion.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::Application
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 AppConfig::Application from aws                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig                                                          │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   Description: My App Config                                                │
│   Id: tb0arg6                                                               │
│   Name: my-appconfig                                                        │
│   Tags:                                                                     │
│     Name: my-appconfig                                                      │
│     gc-created-by-provider: aws                                             │
│     gc-managed-by: grucloud                                                 │
│     gc-project-name: appconfig-simple                                       │
│     gc-stage: dev                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├────────────────────────┬───────────────────────────────────────────────────┤
│ AppConfig::Application │ my-appconfig                                      │
└────────────────────────┴───────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AppConfig::Application" executed in 2s, 99 MB
```
