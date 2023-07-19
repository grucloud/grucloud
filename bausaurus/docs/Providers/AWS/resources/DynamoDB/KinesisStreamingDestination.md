---
id: DynamoDBKinesisStreamingDestination
title: DynamoDB Kinesis Streaming Destination
---

Associate a DynamoDB Table to a Kinesis Stream.

## Sample code

```js
exports.createResources = () => [
  {
    type: "KinesisStreamingDestination",
    group: "DynamoDB",
    dependencies: ({}) => ({
      table: "sam-app-DynamoDBTable-1WVU6LKKNMND3",
      kinesisStream: "sam-app-KinesisStream-i22fijDM7MAY",
    }),
  },
];
```

## Properties

- [EnableKinesisStreamingDestinationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/enablekinesisstreamingdestinationcommandinput.html)

## Dependencies

- [DynamoDB Table](./Table.md)
- [Kinesis Stream](../Kinesis/Stream.md)

## Full Examples

- [serverless-patterns dynamodb-kinesis](https://github.com/grucloud/grucloud/tree/main/examples/aws/)

## List

The tables can be filtered with the _KinesisStreamingDestination_ type:

```sh
gc l -t DynamoDB::KinesisStreamingDestination
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 DynamoDB::KinesisStreamingDestination from aws                                             │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: table-kinesis-stream::sam-app-DynamoDBTable-1WVU6LKKNMND3::arn:aws:kinesis:us-east-1:… │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   DestinationStatus: ACTIVE                                                                  │
│   StreamArn: arn:aws:kinesis:us-east-1:840541460064:stream/sam-app-KinesisStream-i22fijDM7M… │
│   TableName: sam-app-DynamoDBTable-1WVU6LKKNMND3                                             │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├───────────────────────────────────────┬─────────────────────────────────────────────────────┤
│ DynamoDB::KinesisStreamingDestination │ table-kinesis-stream::sam-app-DynamoDBTable-1WVU6L… │
└───────────────────────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t DynamoDB::KinesisStreamingDestination" executed in 5s, 102 MB
```
