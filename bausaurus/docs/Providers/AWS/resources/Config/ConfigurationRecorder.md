---
id: ConfigurationRecorder
title: Configuration Recorder
---

Manages an [AWS ConfigConfiguration Recorder](https://console.aws.amazon.com/config/home?#/dashboard).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ConfigurationRecorder",
    group: "Config",
    properties: ({ config }) => ({
      name: "default",
      recordingGroup: {
        allSupported: true,
        includeGlobalResourceTypes: false,
        resourceTypes: [],
      },
      roleARN: `arn:aws:iam::${config.accountId()}:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig`,
    }),
  },
];
```

## Properties

- [PutConfigurationRecorderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-config-service/interfaces/putconfigurationrecordercommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)

## Used By

- [Config Delivery Channel](./DeliveryChannel.md)

## Full Examples

- [config simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Config/config-simple)

## List

```sh
gc l -t Config::ConfigurationRecorder
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 Config::ConfigurationRecorder from aws                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                │
│ managedByUs: NO                                                              │
│ live:                                                                        │
│   name: default                                                              │
│   recordingGroup:                                                            │
│     allSupported: true                                                       │
│     includeGlobalResourceTypes: false                                        │
│     resourceTypes: []                                                        │
│   roleARN: arn:aws:iam::840541460064:role/aws-service-role/config.amazonaws… │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Config::ConfigurationRecorder │ default                                     │
└───────────────────────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Config::ConfigurationRecorder" executed in 3s, 115 MB
```
