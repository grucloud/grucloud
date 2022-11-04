---
id: DeliveryStream
title: DeliveryStream
---

Manages an [Firehose Delivery Stream](https://console.aws.amazon.com/firehose/home?#/streams).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateDeliveryStreamCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-firehose/interfaces/createdeliverystreamcommandinput.html)

## Dependencies

- [IAM Role](../IAM/Role.md)

## Used By

- [CloudWatchLogs Subscription Filter](../CloudWatchLogs/SubscriptionFilter.md)
- [EC2 FlowLogs](../EC2/FlowLogs.md)
- [ElastiCache Cluster](../ElastiCache/CacheCluster.md)
- [MQ Broker](../MQ/Broker.md)
- [MSK ClusterV2](../MSK/ClusterV2.md)

## Full Examples

- [Step function invoking a Glue job](https://github.com/grucloud/grucloud/tree/main/examples/aws/Firehose/firehose-delivery-stream)

## List

The delivery stream can be filtered with the _Firehose::DeliveryStream_ type:

```sh
gc l -t Firehose::DeliveryStream
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 Firehose::DeliveryStream from aws                                       │
├───────────────────────────────────────────────────────────────────────────┤
│ name: delivery-stream-s3                                                  │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   CreateTimestamp: 2022-11-03T17:45:31.505Z                               │
│   DeliveryStreamARN: arn:aws:firehose:us-east-1:840541460064:deliverystr… │
│   DeliveryStreamEncryptionConfiguration:                                  │
│     Status: DISABLED                                                      │
│   DeliveryStreamName: delivery-stream-s3                                  │
│   DeliveryStreamStatus: ACTIVE                                            │
│   DeliveryStreamType: DirectPut                                           │
│   HasMoreDestinations: false                                              │
│   VersionId: 1                                                            │
│   S3DestinationDescription:                                               │
│     BucketARN: arn:aws:s3:::gc-firehose-destination                       │
│     BufferingHints:                                                       │
│       IntervalInSeconds: 300                                              │
│       SizeInMBs: 5                                                        │
│     CloudWatchLoggingOptions:                                             │
│       Enabled: true                                                       │
│       LogGroupName: /aws/kinesisfirehose/delivery-stream-s3               │
│       LogStreamName: DestinationDelivery                                  │
│     CompressionFormat: UNCOMPRESSED                                       │
│     EncryptionConfiguration:                                              │
│       NoEncryptionConfig: NoEncryption                                    │
│     ErrorOutputPrefix:                                                    │
│     Prefix:                                                               │
│     RoleARN: arn:aws:iam::840541460064:role/service-role/KinesisFirehose… │
│   ExtendedS3DestinationConfiguration:                                     │
│     BucketARN: arn:aws:s3:::gc-firehose-destination                       │
│     BufferingHints:                                                       │
│       IntervalInSeconds: 300                                              │
│       SizeInMBs: 5                                                        │
│     CloudWatchLoggingOptions:                                             │
│       Enabled: true                                                       │
│       LogGroupName: /aws/kinesisfirehose/delivery-stream-s3               │
│       LogStreamName: DestinationDelivery                                  │
│     CompressionFormat: UNCOMPRESSED                                       │
│     DataFormatConversionConfiguration:                                    │
│       Enabled: false                                                      │
│     EncryptionConfiguration:                                              │
│       NoEncryptionConfig: NoEncryption                                    │
│     ErrorOutputPrefix:                                                    │
│     Prefix:                                                               │
│     ProcessingConfiguration:                                              │
│       Enabled: false                                                      │
│       Processors: []                                                      │
│     RoleARN: arn:aws:iam::840541460064:role/service-role/KinesisFirehose… │
│     S3BackupMode: Disabled                                                │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: flow-logs-firehose                                           │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: LogDeliveryEnabled                                             │
│       Value: true                                                         │
│     - Key: Name                                                           │
│       Value: delivery-stream-s3                                           │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────────────┬───────────────────────────────────────────────┤
│ Firehose::DeliveryStream │ delivery-stream-s3                            │
└──────────────────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Firehose::DeliveryStream" executed in 4s, 114 MB
```
