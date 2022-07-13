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

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/dynamodb-kinesis)

## List

The tables can be filtered with the _KinesisStreamingDestination_ type:

```sh
gc l -t DynamoDB::KinesisStreamingDestination
```

```txt
```
