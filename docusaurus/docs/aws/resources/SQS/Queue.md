---
id: Queue
title: Queue
---

Manages an [SQS Queue](https://console.aws.amazon.com/sqs/v2/home?#/).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Queue",
    group: "SQS",
    name: "my-queue",
    properties: ({}) => ({
      tags: {
        "my-tag": "my-value",
      },
    }),
  },
];
```

## Properties

- [CreateQueueCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html)

## Used By

- [StepFunctions StateMachine](../StepFunctions/StateMachine.md)

## Full Examples

- [Simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/SQS/sqs-simple)

## List

The queues can be filtered with the _Queue_ type:

```sh
gc l -t Queue
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 SQS::Queue from aws                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: my-queue                                                               │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   QueueUrl: https://sqs.eu-west-2.amazonaws.com/840541460064/my-queue        │
│   Attributes:                                                                │
│     QueueArn: arn:aws:sqs:eu-west-2:840541460064:my-queue                    │
│     ApproximateNumberOfMessages: 0                                           │
│     ApproximateNumberOfMessagesNotVisible: 0                                 │
│     ApproximateNumberOfMessagesDelayed: 0                                    │
│     CreatedTimestamp: 1632404531                                             │
│     LastModifiedTimestamp: 1632404531                                        │
│     VisibilityTimeout: 30                                                    │
│     MaximumMessageSize: 262144                                               │
│     MessageRetentionPeriod: 345600                                           │
│     DelaySeconds: 0                                                          │
│     ReceiveMessageWaitTimeSeconds: 0                                         │
│   tags:                                                                      │
│     gc-managed-by: grucloud                                                  │
│     gc-project-name: lambda-sqs-nodejs                                       │
│     gc-stage: dev                                                            │
│     my-tag: my-value                                                         │
│     gc-created-by-provider: aws                                              │
│     Name: my-queue                                                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├────────────┬────────────────────────────────────────────────────────────────┤
│ SQS::Queue │ my-queue                                                       │
└────────────┴────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Queue" executed in 4s
```
