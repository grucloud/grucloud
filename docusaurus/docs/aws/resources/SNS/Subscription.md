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

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-simple)
- [SNS with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-lambda)
- [SNS with SQS](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-sqs)

## List

The subscription can be filtered with the _Subscription_ type:

```sh
gc l -t Subscription
```

```txt

```
