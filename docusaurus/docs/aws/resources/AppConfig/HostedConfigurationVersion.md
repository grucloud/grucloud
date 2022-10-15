---
id: HostedConfigurationVersion
title: Hosted Configuration Version
---

Manages an [AppConfig Hosted Configuration Version](https://console.aws.amazon.com/systems-manager/appconfig).

## Sample code

```js
exports.createResources = () => [
  {
    type: "HostedConfigurationVersion",
    group: "AppConfig",
    properties: ({}) => ({
      Content: "yolo=3",
      ContentType: "text/plain",
    }),
    dependencies: ({}) => ({
      configurationProfile: "my-appconfig::profile-freeform",
    }),
  },
];
```

## Properties

- [CreateHostedConfigurationVersionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-appconfig/interfaces/createhostedconfigurationversioncommandinput.html)

## Dependencies

- [AppConfig Application](./Application.md)
- [AppConfig Configuration Profile](./ConfigurationProfile.md)

## Full Examples

- [appconfig simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppConfig/appconfig-simple)

## List

```sh
gc l -t AppConfig::HostedConfigurationVersion
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 AppConfig::HostedConfigurationVersion from aws                         │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-appconfig::profile-freeform                                     │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ApplicationId: sy4ot8r                                                 │
│   ConfigurationProfileId: due8kag                                        │
│   Content: yolo=3                                                        │
│   ContentType: text/plain                                                │
│   VersionNumber: 1                                                       │
│   Latest: true                                                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────────────────────┬─────────────────────────────────┤
│ AppConfig::HostedConfigurationVersion │ my-appconfig::profile-freeform  │
└───────────────────────────────────────┴─────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t AppConfig::HostedConfigurationVersion" executed in 5s, 94 MB
```
