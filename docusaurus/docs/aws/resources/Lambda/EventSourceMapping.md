---
id: EventSourceMapping
title: Event Source Mapping
---

Provides an [Event Source Mapping](https://console.aws.amazon.com/lambda/home)

## Examples

### SQS Queue Source Mapping

```js
exports.createResources = () => [
  {
    type: "EventSourceMapping",
    group: "Lambda",
    name: "mapping-lambda-hello-world-my-queue-lambda",
    properties: ({}) => ({
      BatchSize: 10,
      MaximumBatchingWindowInSeconds: 0,
    }),
    dependencies: () => ({
      lambdaFunction: "lambda-hello-world",
      sqsQueue: "my-queue-lambda",
    }),
  },
];
```

## Source Code Examples

- [sqs feeding lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/sqs-lambda/resources.js)
- [kinesis stream feeding lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/Kinesis/kinesis-stream)

## Properties

- [CreateEventSourceMappingCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createeventsourcemappingcommandinput.html)

## Dependencies

- [Lambda Function](./Function.md)
- [SQS Queue](../SQS/Queue.md)
- [Kinesis Stream](../Kinesis/Stream.md)

## List

The list of event source mappings can be displayed and filtered with the type **EventSourceMapping**:

```sh
gc list -t EventSourceMapping
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 Lambda::EventSourceMapping from aws                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: mapping-lambda-hello-world-my-queue                                    │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   UUID: 369cfa51-9364-4cba-88d4-7311317adc37                                 │
│   StartingPosition: null                                                     │
│   StartingPositionTimestamp: null                                            │
│   BatchSize: 10                                                              │
│   MaximumBatchingWindowInSeconds: 0                                          │
│   ParallelizationFactor: null                                                │
│   EventSourceArn: arn:aws:sqs:eu-west-2:840541460064:my-queue                │
│   FunctionArn: arn:aws:lambda:eu-west-2:840541460064:function:lambda-hello-… │
│   LastModified: 2021-09-23T13:46:06.664Z                                     │
│   LastProcessingResult: null                                                 │
│   State: Enabled                                                             │
│   StateTransitionReason: USER_INITIATED                                      │
│   MaximumRecordAgeInSeconds: null                                            │
│   BisectBatchOnFunctionError: null                                           │
│   MaximumRetryAttempts: null                                                 │
│   TumblingWindowInSeconds: null                                              │
│   Tags:                                                                      │
│     gc-project-name: lambda-sqs-nodejs                                       │
│     gc-managed-by: grucloud                                                  │
│     gc-stage: dev                                                            │
│     gc-created-by-provider: aws                                              │
│     Name: lambda-hello-world                                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├────────────────────────────┬────────────────────────────────────────────────┤
│ Lambda::EventSourceMapping │ mapping-lambda-hello-world-my-queue            │
└────────────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EventSourceMapping" executed in 13s
```
