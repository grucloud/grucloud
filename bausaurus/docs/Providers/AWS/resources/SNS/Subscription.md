---
id: SNSSubscription
title: Subscription
---

Manages an [SNS Subscription](https://console.aws.amazon.com/sns/v3/home?#/).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Subscription",
    group: "SNS",
    properties: ({}) => ({
      RawMessageDelivery: "false",
      PendingConfirmation: "false",
      ConfirmationWasAuthenticated: "true",
    }),
    dependencies: () => ({
      snsTopic: "app-MySnsTopic",
      lambdaFunction: "app-TopicConsumerFunction1",
    }),
  },
];
```

## Properties

- [SubscribeInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/modules/subscribeinput.html)

## Dependencies

- [SNS Topic](./Topic.md)
- [SQS Queue](../SQS/Queue.md)
- [Lambda Function](../Lambda/Function.md)

## Full Examples

- [SNS with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sns-lambda)

## List

The subscription can be filtered with the _Subscription_ type:

```sh
gc l -t Subscription
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 SNS::Subscription from aws                                              │
├───────────────────────────────────────────────────────────────────────────┤
│ name: subscription::sam-app-MySnsTopic-1Q2VS8SMOPR20::lambda::sam-app-To… │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Owner: 840541460064                                                     │
│   RawMessageDelivery: false                                               │
│   TopicArn: arn:aws:sns:us-east-1:840541460064:sam-app-MySnsTopic-1Q2VS8… │
│   Endpoint: arn:aws:lambda:us-east-1:840541460064:function:sam-app-Topic… │
│   Protocol: lambda                                                        │
│   PendingConfirmation: false                                              │
│   ConfirmationWasAuthenticated: true                                      │
│   SubscriptionArn: arn:aws:sns:us-east-1:840541460064:sam-app-MySnsTopic… │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────────┬──────────────────────────────────────────────────────┤
│ SNS::Subscription │ subscription::sam-app-MySnsTopic-1Q2VS8SMOPR20::lam… │
└───────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Subscription" executed in 4s, 105 MB
```
