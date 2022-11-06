---
id: Policy
title: Policy
---

Manages a [Application Auto Scaling Policy](https://console.aws.amazon.com/awsautoscaling/home#dashboard).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Policy",
    group: "ApplicationAutoScaling",
    properties: ({}) => ({
      PolicyName: "$my-table-scaling-policy",
      PolicyType: "TargetTrackingScaling",
      ResourceId: "table/my-table",
      ScalableDimension: "dynamodb:table:WriteCapacityUnits",
      ServiceNamespace: "dynamodb",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: {
          PredefinedMetricType: "DynamoDBWriteCapacityUtilization",
        },
        TargetValue: 70,
      },
    }),
    dependencies: ({}) => ({
      target: "table/my-table::dynamodb:table:WriteCapacityUnits",
    }),
  },
];
```

## Properties

- [PutScalingPolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-application-auto-scaling/interfaces/putscalingpolicycommandinput.html)

## Dependencies

- [ApplicationAutoScaling Target](./Target.md)

## Used By

## Full Examples

- [appautoscaling-dynamodb](https://github.com/grucloud/grucloud/tree/main/examples/aws/ApplicationAutoScaling/appautoscaling-dynamodb)

## List

```sh
gc l -t ApplicationAutoScaling::Policy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 ApplicationAutoScaling::Policy from aws                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: dynamodb:table:ReadCapacityUnits::$my-table-scaling-policy                           │
│ managedByUs: NO                                                                            │
│ live:                                                                                      │
│   Alarms: []                                                                               │
│   CreationTime: 2022-07-09T17:49:01.270Z                                                   │
│   PolicyARN: arn:aws:autoscaling:us-east-1:840541460064:scalingPolicy:ca928ab9-af86-4afa-… │
│   PolicyName: $my-table-scaling-policy                                                     │
│   PolicyType: TargetTrackingScaling                                                        │
│   ResourceId: table/my-table                                                               │
│   ScalableDimension: dynamodb:table:ReadCapacityUnits                                      │
│   ServiceNamespace: dynamodb                                                               │
│   TargetTrackingScalingPolicyConfiguration:                                                │
│     PredefinedMetricSpecification:                                                         │
│       PredefinedMetricType: DynamoDBReadCapacityUtilization                                │
│     TargetValue: 70                                                                        │
│                                                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: dynamodb:table:WriteCapacityUnits::$my-table-scaling-policy                          │
│ managedByUs: NO                                                                            │
│ live:                                                                                      │
│   Alarms: []                                                                               │
│   CreationTime: 2022-07-09T17:49:02.577Z                                                   │
│   PolicyARN: arn:aws:autoscaling:us-east-1:840541460064:scalingPolicy:1ae2aff9-cff1-4783-… │
│   PolicyName: $my-table-scaling-policy                                                     │
│   PolicyType: TargetTrackingScaling                                                        │
│   ResourceId: table/my-table                                                               │
│   ScalableDimension: dynamodb:table:WriteCapacityUnits                                     │
│   ServiceNamespace: dynamodb                                                               │
│   TargetTrackingScalingPolicyConfiguration:                                                │
│     PredefinedMetricSpecification:                                                         │
│       PredefinedMetricType: DynamoDBWriteCapacityUtilization                               │
│     TargetValue: 70                                                                        │
│                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                       │
├────────────────────────────────┬──────────────────────────────────────────────────────────┤
│ ApplicationAutoScaling::Policy │ dynamodb:table:ReadCapacityUnits::$my-table-scaling-pol… │
│                                │ dynamodb:table:WriteCapacityUnits::$my-table-scaling-po… │
└────────────────────────────────┴──────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t ApplicationAutoScaling::Policy" executed in 3s, 106 MB
```
