---
id: SNSTopic
title: Topic
---

Manages an [SNS Topic](https://console.aws.amazon.com/sns/v3/home?#/).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Topic",
    group: "SNS",
    name: "MySnsTopic",
    properties: ({ config }) => ({
      Attributes: {
        Policy: {
          Version: "2008-10-17",
          Id: "__default_policy_ID",
          Statement: [
            {
              Sid: "__default_statement_ID",
              Effect: "Allow",
              Principal: {
                AWS: "*",
              },
              Action: [
                "SNS:GetTopicAttributes",
                "SNS:SetTopicAttributes",
                "SNS:AddPermission",
                "SNS:RemovePermission",
                "SNS:DeleteTopic",
                "SNS:Subscribe",
                "SNS:ListSubscriptionsByTopic",
                "SNS:Publish",
              ],
              Resource: `arn:aws:sns:${
                config.region
              }:${config.accountId()}:MySnsTopic`,
              Condition: {
                StringEquals: {
                  "AWS:SourceOwner": `${config.accountId()}`,
                },
              },
            },
          ],
        },
        DisplayName: "",
        DeliveryPolicy: {
          http: {
            defaultHealthyRetryPolicy: {
              minDelayTarget: 20,
              maxDelayTarget: 20,
              numRetries: 3,
              numMaxDelayRetries: 0,
              numNoDelayRetries: 0,
              numMinDelayRetries: 0,
              backoffFunction: "linear",
            },
            disableSubscriptionOverrides: false,
          },
        },
      },
    }),
  },
];
```

## Properties

- [CreateTopicCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/interfaces/createtopiccommandinput.html)

## Dependencies

- [KMS Key](../KMS/Key.md)

## Used By

- [SNS Subscription](./Subscription.md)
- [StepFunctions StateMachine](../StepFunctions/StateMachine.md)
- [S3 Bucket](../S3/Bucket.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-simple)
- [SNS with Lambda](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-lambda)
- [SNS with SQS](https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-sqs)

## List

The topics can be filtered with the _Topic_ type:

```sh
gc l -t Topic
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SNS::Topic from aws                                                                         │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-topic                                                                                │
│ managedByUs: Yes                                                                              │
│ live:                                                                                         │
│   Attributes:                                                                                 │
│     Policy:                                                                                   │
│       Version: 2008-10-17                                                                     │
│       Id: __default_policy_ID                                                                 │
│       Statement:                                                                              │
│         - Sid: __default_statement_ID                                                         │
│           Effect: Allow                                                                       │
│           Principal:                                                                          │
│             AWS: *                                                                            │
│           Action:                                                                             │
│             - "SNS:GetTopicAttributes"                                                        │
│             - "SNS:SetTopicAttributes"                                                        │
│             - "SNS:AddPermission"                                                             │
│             - "SNS:RemovePermission"                                                          │
│             - "SNS:DeleteTopic"                                                               │
│             - "SNS:Subscribe"                                                                 │
│             - "SNS:ListSubscriptionsByTopic"                                                  │
│             - "SNS:Publish"                                                                   │
│           Resource: arn:aws:sns:us-east-1:840541460064:my-topic                               │
│           Condition:                                                                          │
│             StringEquals:                                                                     │
│               AWS:SourceOwner: 840541460064                                                   │
│     Owner: 840541460064                                                                       │
│     SubscriptionsPending: 0                                                                   │
│     TopicArn: arn:aws:sns:us-east-1:840541460064:my-topic                                     │
│     SubscriptionsConfirmed: 0                                                                 │
│     DisplayName: My Topic                                                                     │
│     DeliveryPolicy:                                                                           │
│       http:                                                                                   │
│         defaultHealthyRetryPolicy:                                                            │
│           minDelayTarget: 20                                                                  │
│           maxDelayTarget: 20                                                                  │
│           numRetries: 3                                                                       │
│           numMaxDelayRetries: 0                                                               │
│           numNoDelayRetries: 0                                                                │
│           numMinDelayRetries: 0                                                               │
│           backoffFunction: linear                                                             │
│         disableSubscriptionOverrides: false                                                   │
│     SubscriptionsDeleted: 0                                                                   │
│   Tags:                                                                                       │
│     - Key: gc-created-by-provider                                                             │
│       Value: aws                                                                              │
│     - Key: gc-managed-by                                                                      │
│       Value: grucloud                                                                         │
│     - Key: gc-project-name                                                                    │
│       Value: sns-simple                                                                       │
│     - Key: gc-stage                                                                           │
│       Value: dev                                                                              │
│     - Key: mykey                                                                              │
│       Value: myvalue                                                                          │
│     - Key: Name                                                                               │
│       Value: my-topic                                                                         │
│                                                                                               │
└───────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                          │
├────────────┬─────────────────────────────────────────────────────────────────────────────────┤
│ SNS::Topic │ my-topic                                                                        │
└────────────┴─────────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Topic" executed in 6s, 116 MB
```
