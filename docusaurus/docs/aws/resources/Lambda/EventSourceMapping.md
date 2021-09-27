---
id: LambdaEventSourceMapping
title: Event Source Mapping
---

Provides an [Event Source Mapping](https://console.aws.amazon.com/lambda/home)

## Examples

### SQS Queue Source Mapping

```js
const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const iamPolicy = provider.IAM.makePolicy({
  name: "lambda-policy",
  properties: () => lambdaPolicy,
});

const iamRole = provider.IAM.makeRole({
  name: "lambda-role",
  dependencies: { policies: [iamPolicy] },
  properties: () => lambdaAssumePolicy,
});

const lambdaFunction = provider.Lambda.makeFunction({
  name: "lambda-hello-world", // Source must be located in the direcory 'lambda-hello-world'
  dependencies: { role: iamRole },
  properties: () => ({
    PackageType: "Zip",
    Handler: "helloworld.handler", // The handler function must de defined in lambda-hello-world/helloworkd.js
    Runtime: "nodejs14.x",
  }),
});

const sqsQueue = provider.SQS.makeQueue({
  name: "my-queue",
  properties: () => ({
    Attributes: {
      VisibilityTimeout: "30",
      MaximumMessageSize: "262144",
      MessageRetentionPeriod: "345600",
      DelaySeconds: "0",
      ReceiveMessageWaitTimeSeconds: "0",
    },
    tags: {
      "my-tag": "my-value",
    },
  }),
});

provider.Lambda.makeEventSourceMapping({
  name: "mapping-lambda-hello-world-my-queue",
  dependencies: { lambdaFunction, sqsQueue },
  properties: () => ({}),
});
```

## Source Code Examples

- [sqs lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/lambda/nodejs/sqs-lambda/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createeventsourcemappingcommandinput.html)

## Dependencies

- [Lambda Function](./Function.md)
- [SQS Queue](../SQS/Queue.md)

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
