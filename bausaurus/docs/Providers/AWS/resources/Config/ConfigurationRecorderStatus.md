---
id: ConfigurationRecorderStatus
title: Configuration Recorder
---

Manages an [AWS Config Delivery Channel Status](https://console.aws.amazon.com/config/home?#/dashboard).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ConfigurationRecorderStatus",
    group: "Config",
    properties: ({}) => ({
      recording: true,
    }),
    dependencies: ({}) => ({
      deliveryChannel: "default",
    }),
  },
];
```

## Properties

- [StartConfigurationRecorderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-config-service/interfaces/startconfigurationrecordercommandinput.html)

## Dependencies

- [Config Delivery Channel](./DeliveryChannel.md)

## Full Examples

- [config simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Config/config-simple)

## List

```sh
gc l -t Config::ConfigurationRecorderStatus
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 Config::ConfigurationRecorderStatus from aws                          │
├─────────────────────────────────────────────────────────────────────────┤
│ name: default                                                           │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   ConfigurationRecorderName: default                                    │
│   lastStartTime: 2022-11-07T22:27:03.104Z                               │
│   lastStatus: PENDING                                                   │
│   lastStatusChangeTime: 2022-11-07T22:27:03.104Z                        │
│   recording: true                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├─────────────────────────────────────┬──────────────────────────────────┤
│ Config::ConfigurationRecorderStatus │ default                          │
└─────────────────────────────────────┴──────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Config::ConfigurationRecorderStatus" executed in 2s, 104 MB

```
