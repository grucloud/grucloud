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
    type: "Role",
    group: "IAM",
    name: "lambda-role",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["lambda-policy"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "lambda-policy",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-hello-world",
    properties: ({}) => ({
      Handler: "helloworld.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
    }),
    dependencies: () => ({
      role: "lambda-role",
    }),
  },
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
  {
    type: "Queue",
    group: "SQS",
    name: "my-queue-lambda",
    properties: ({}) => ({
      tags: {
        "my-tag": "my-value",
      },
    }),
  },
];
```

## Source Code Examples

- [sqs lambda](https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/sqs-lambda/resources.js)

## Properties

- [CreateEventSourceMappingCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createeventsourcemappingcommandinput.html)

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
