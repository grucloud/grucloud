---
id: Table
title: Table
---

Manages an [DynamoDB Table](https://console.aws.amazon.com/dynamodbv2/home?#tables).

## Sample code

```js
provider.DynamoDB.makeTable({
  name: "myTable"
  properties: () => ({
    AttributeDefinitions: [
      {
        AttributeName: "Id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Id",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    Tags: [
      {
        Key: "TOTOKEY",
        Value: "TOTO",
      },
    ],
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property)

## Dependencies

- [KMS Key](../KMS/Key.md)

## Full Examples

- [Simple table](https://github.com/grucloud/grucloud/tree/main/examples/aws/dynamodb/table)

## List

The tables can be filtered with the _Table_ type:

```sh
gc l -t Table
```

```txt

```
