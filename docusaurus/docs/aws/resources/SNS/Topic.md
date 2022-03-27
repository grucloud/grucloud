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

## USed By

- [SNS Subscription](./Subscription.md)

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

```
