---
id: DeliveryChannel
title: Delivery Channel
---

Manages an [Config Delivery Channel](https://console.aws.amazon.com/config/home?#/dashboard).

## Sample code

```js
exports.createResources = () => [
  {
    type: "DeliveryChannel",
    group: "Config",
    properties: ({}) => ({
      name: "default",
    }),
    dependencies: ({ config }) => ({
      configurationRecorder: "default",
      s3Bucket: `config-bucket-${config.accountId()}`,
    }),
  },
];
```

## Properties

- [PutDeliveryChannelCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-config-service/interfaces/putdeliverychannelcommandinput.html)

## Dependencies

- [Config ConfigurationRecorder](./ConfigurationRecorder.md)
- [S3 Bucket](../S3/Bucket.md)

## Used By

- [Config Configuration Recorder Status](./ConfigurationRecorderStatus.md)

## Full Examples

- [config simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Config/config-simple)

## List

```sh
gc l -t Config::DeliveryChannel
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 Config::DeliveryChannel from aws                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                │
│ managedByUs: NO                                                              │
│ live:                                                                        │
│   name: default                                                              │
│   s3BucketName: config-bucket-840541460064                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├─────────────────────────┬───────────────────────────────────────────────────┤
│ Config::DeliveryChannel │ default                                           │
└─────────────────────────┴───────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Config::DeliveryChannel" executed in 2s, 113 MB
```
