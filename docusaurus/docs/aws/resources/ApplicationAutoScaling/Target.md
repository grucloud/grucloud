---
id: Target
title: Target
---

Manages a [Application Auto Scaling Target](https://console.aws.amazon.com/awsautoscaling/home#dashboard).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Target",
    group: "ApplicationAutoScaling",
    properties: ({}) => ({
      MaxCapacity: 10,
      MinCapacity: 1,
      ResourceId: "table/my-table",
      ScalableDimension: "dynamodb:table:ReadCapacityUnits",
      ServiceNamespace: "dynamodb",
    }),
    dependencies: ({}) => ({
      dynamoDbTable: "my-table",
    }),
  },
];
```

## Properties

- [RegisterScalableTargetCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-application-auto-scaling/interfaces/registerscalabletargetcommandinput.html)

## Dependencies

- [AppStream Fleet](../AppStream/Fleet.md)
- [Comprehend Document Classifier Endpoint](../Comprehend/DocumentClassifierEndpoint.md)
- [Comprehend Entity Recognizer Endpoint](../Comprehend/EntityRecognizerEndpoint.md)
- [DynamoDB Table](../DynamoDB/Table.md)
- [ECS Service](../ECS/Service.md)
- [EC2 Spot Fleet](../EC2/SpotFleet.md)
- [ElastiCache Replication Group](../ElastiCache/ReplicationGroup.md)
- [EMR Cluster](../EMR/Cluster.md)
- [Keyspaces Table](../Keyspaces/Table.md)
- [Lambda Function](../Lambda/Function.md)
- [Neptune Cluster](../Neptune/Cluster.md)
- [MSK Cluster](../MSK/Cluster.md)
- [RDS Cluster](../RDS/DBCluster.md)
- [SageMaker Endpoint](../SageMaker/endpoint.md)

## Used By

- [ApplicationAutoScaling Policy](./Policy.md)

## Full Examples

- [appautoscaling-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApplicationAutoScaling/appautoscaling-dynamodb)

## List

```sh
gc l -t ApplicationAutoScaling::Target
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────┐
│ 2 ApplicationAutoScaling::Target from aws                                     │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: table/my-table::dynamodb:table:ReadCapacityUnits                        │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   CreationTime: 2022-11-06T01:31:32.146Z                                      │
│   MaxCapacity: 10                                                             │
│   MinCapacity: 1                                                              │
│   ResourceId: table/my-table                                                  │
│   RoleARN: arn:aws:iam::840541460064:role/aws-service-role/dynamodb.applicat… │
│   ScalableDimension: dynamodb:table:ReadCapacityUnits                         │
│   ServiceNamespace: dynamodb                                                  │
│   SuspendedState:                                                             │
│     DynamicScalingInSuspended: false                                          │
│     DynamicScalingOutSuspended: false                                         │
│     ScheduledScalingSuspended: false                                          │
│                                                                               │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: table/my-table::dynamodb:table:WriteCapacityUnits                       │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   CreationTime: 2022-11-06T01:31:32.121Z                                      │
│   MaxCapacity: 10                                                             │
│   MinCapacity: 1                                                              │
│   ResourceId: table/my-table                                                  │
│   RoleARN: arn:aws:iam::840541460064:role/aws-service-role/dynamodb.applicat… │
│   ScalableDimension: dynamodb:table:WriteCapacityUnits                        │
│   ServiceNamespace: dynamodb                                                  │
│   SuspendedState:                                                             │
│     DynamicScalingInSuspended: false                                          │
│     DynamicScalingOutSuspended: false                                         │
│     ScheduledScalingSuspended: false                                          │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                          │
├────────────────────────────────┬─────────────────────────────────────────────┤
│ ApplicationAutoScaling::Target │ table/my-table::dynamodb:table:ReadCapacit… │
│                                │ table/my-table::dynamodb:table:WriteCapaci… │
└────────────────────────────────┴─────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t ApplicationAutoScaling::Target" executed in 2s, 167 MB
```
