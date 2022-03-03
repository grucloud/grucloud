---
id: Table
title: Table
---

Manages an [DynamoDB Table](https://console.aws.amazon.com/dynamodbv2/home?#tables).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Table",
    group: "DynamoDB",
    name: "myTable",
    properties: ({}) => ({
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
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property)

## Dependencies

- [KMS Key](../KMS/Key.md)

## Full Examples

- [Simple table](https://github.com/grucloud/grucloud/tree/main/examples/aws/DynamoDB/table)

## List

The tables can be filtered with the _Table_ type:

```sh
gc l -t Table
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 DynamoDB::Table from aws                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ name: myTable                                                           │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   AttributeDefinitions:                                                 │
│     - AttributeName: Id                                                 │
│       AttributeType: S                                                  │
│   TableName: myTable                                                    │
│   KeySchema:                                                            │
│     - AttributeName: Id                                                 │
│       KeyType: HASH                                                     │
│   TableStatus: ACTIVE                                                   │
│   CreationDateTime: 2022-03-03T20:19:23.219Z                            │
│   ProvisionedThroughput:                                                │
│     NumberOfDecreasesToday: 0                                           │
│     ReadCapacityUnits: 5                                                │
│     WriteCapacityUnits: 5                                               │
│   TableSizeBytes: 0                                                     │
│   ItemCount: 0                                                          │
│   TableArn: arn:aws:dynamodb:us-east-1:840541460064:table/myTable       │
│   TableId: b02d1674-b8de-4a0c-bc93-65b49348a6ff                         │
│   Tags:                                                                 │
│     - Key: gc-created-by-provider                                       │
│       Value: aws                                                        │
│     - Key: gc-managed-by                                                │
│       Value: grucloud                                                   │
│     - Key: gc-project-name                                              │
│       Value: example-grucloud-dynamodb-table                            │
│     - Key: gc-stage                                                     │
│       Value: dev                                                        │
│     - Key: Name                                                         │
│       Value: myTable                                                    │
│     - Key: TOTOKEY                                                      │
│       Value: TOTO                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├─────────────────┬──────────────────────────────────────────────────────┤
│ DynamoDB::Table │ myTable                                              │
└─────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Table" executed in 3s, 95 MB
```
