---
id: Stream
title: Stream
---

Manages a [Kinesis Stream](https://console.aws.amazon.com/kinesis/home?#/streams/list).

## Example

Create a Kinesis stream:

```js
exports.createResources = () => [
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamModeDetails: {
        StreamMode: "ON_DEMAND",
      },
      StreamName: "my-stream",
    }),
  },
];
```

## Code Examples

- [simple stream](https://github.com/grucloud/grucloud/blob/main/examples/aws/kinesis/kinesis-stream)
- [sererless-patterns dynamodb-kinesis](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/dynamodb-kinesis)

## Properties

- [CreateStreamCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kinesis/interfaces/createstreamcommandinput.html)

## Used By

- [DynamoDB KinesisStreamingDestination](../DynamoDB/KinesisStreamingDestination.md)
- [Lambda EventSourceMapping](../Lambda/EventSourceMapping.md)

## List

```sh
gc l -t Stream
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Kinesis::Stream from aws                                                           │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-stream                                                                      │
│ managedByUs: Yes                                                                     │
│ live:                                                                                │
│   EncryptionType: NONE                                                               │
│   EnhancedMonitoring:                                                                │
│     - ShardLevelMetrics: []                                                          │
│   HasMoreShards: false                                                               │
│   RetentionPeriodHours: 24                                                           │
│   Shards:                                                                            │
│     -                                                                                │
│       HashKeyRange:                                                                  │
│         EndingHashKey: 85070591730234615865843651857942052863                        │
│         StartingHashKey: 0                                                           │
│       SequenceNumberRange:                                                           │
│         StartingSequenceNumber: 496313298437890079740292708241643927912316282112080… │
│       ShardId: shardId-000000000000                                                  │
│     -                                                                                │
│       HashKeyRange:                                                                  │
│         EndingHashKey: 170141183460469231731687303715884105727                       │
│         StartingHashKey: 85070591730234615865843651857942052864                      │
│       SequenceNumberRange:                                                           │
│         StartingSequenceNumber: 496313298438113087192278014473059285095042765727140… │
│       ShardId: shardId-000000000001                                                  │
│     -                                                                                │
│       HashKeyRange:                                                                  │
│         EndingHashKey: 255211775190703847597530955573826158591                       │
│         StartingHashKey: 170141183460469231731687303715884105728                     │
│       SequenceNumberRange:                                                           │
│         StartingSequenceNumber: 496313298438336094644263320704474642277769249342200… │
│       ShardId: shardId-000000000002                                                  │
│     -                                                                                │
│       HashKeyRange:                                                                  │
│         EndingHashKey: 340282366920938463463374607431768211455                       │
│         StartingHashKey: 255211775190703847597530955573826158592                     │
│       SequenceNumberRange:                                                           │
│         StartingSequenceNumber: 496313298438559102096248626935889999460495732957260… │
│       ShardId: shardId-000000000003                                                  │
│   StreamARN: arn:aws:kinesis:us-east-1:840541460064:stream/my-stream                 │
│   StreamCreationTimestamp: 2022-07-12T20:51:56.000Z                                  │
│   StreamModeDetails:                                                                 │
│     StreamMode: ON_DEMAND                                                            │
│   StreamName: my-stream                                                              │
│   StreamStatus: ACTIVE                                                               │
│   Tags:                                                                              │
│     - Key: gc-created-by-provider                                                    │
│       Value: aws                                                                     │
│     - Key: gc-managed-by                                                             │
│       Value: grucloud                                                                │
│     - Key: gc-project-name                                                           │
│       Value: kinesis-stream                                                          │
│     - Key: gc-stage                                                                  │
│       Value: dev                                                                     │
│     - Key: Name                                                                      │
│       Value: my-stream                                                               │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├─────────────────┬───────────────────────────────────────────────────────────────────┤
│ Kinesis::Stream │ my-stream                                                         │
└─────────────────┴───────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Stream" executed in 5s, 111 MB
```
