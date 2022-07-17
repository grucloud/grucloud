---
id: StateMachine
title: State Machine
---

Manages an [Step Function State Machine](https://console.aws.amazon.com/states/home?#/).

## Sample code

```js
exports.createResources = () => [
  {
    type: "StateMachine",
    group: "StepFunctions",
    name: "MyStateMachine-SwVayjQIlTdv",
    properties: ({}) => ({
      definition: {
        StartAt: "SendCustomEvent",
        States: {
          SendCustomEvent: {
            End: true,
            Parameters: {
              Body: "Hello World",
              Bucket: "gc-my-sfn-bucket-destination",
              Key: "filename.txt",
            },
            Resource: "arn:aws:states:::aws-sdk:s3:putObject",
            Type: "Task",
          },
        },
      },
      loggingConfiguration: {
        includeExecutionData: false,
        level: "OFF",
      },
      tags: [
        {
          key: "stateMachine:createdBy",
          value: "SAM",
        },
      ],
    }),
    dependencies: () => ({
      role: "sam-app-WorkflowExecutionRole-7I137IX4DEEI",
    }),
  },
];
```

## Properties

- [CreateStateMachineCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sfn/interfaces/createstatemachinecommandinput.html)

## Dependecies

- [Lamda Function](../Lambda/Function.md)
- [Glue Job](../Glue/Job.md)
- [SQS Queues](../SQS/Queue.md)
- [SNS Topic](../SNS/Topic.md)

## Used By

- [IAM Role](../IAM/Role.md)
- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)

## Full Examples

- [create S3 object](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-s3)
- [send item to dynamoDB](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-dynamodb)

## List

The topics can be filtered with the _StateMachine_ type:

```sh
gc l -t StateMachine
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────┐
│ 1 StepFunctions::StateMachine from aws                        │
├───────────────────────────────────────────────────────────────┤
│ name: StateMachinetoDDB-OZxx41bNDei3                          │
│ managedByUs: Yes                                              │
│ live:                                                         │
│   creationDate: 2022-03-31T19:00:26.840Z                      │
│   definition:                                                 │
│     StartAt: SendToDDB                                        │
│     States:                                                   │
│       ReadFromDDB:                                            │
│         End: true                                             │
│         OutputPath: $.output_from_ddb_get.Item                │
│         Parameters:                                           │
│           Key:                                                │
│             id.$: $.id                                        │
│           TableName: my-table                                 │
│         Resource: arn:aws:states:::dynamodb:getItem           │
│         ResultPath: $.output_from_ddb_get                     │
│         Type: Task                                            │
│       SendToDDB:                                              │
│         Next: ReadFromDDB                                     │
│         Parameters:                                           │
│           Item:                                               │
│             description.$: States.Format('Hello, my id is {}… │
│             id.$: $.id                                        │
│           TableName: my-table                                 │
│         Resource: arn:aws:states:::dynamodb:putItem           │
│         ResultPath: $.output_from_ddb_put                     │
│         Type: Task                                            │
│   loggingConfiguration:                                       │
│     includeExecutionData: false                               │
│     level: OFF                                                │
│   name: StateMachinetoDDB-OZxx41bNDei3                        │
│   roleArn: arn:aws:iam::840541460064:role/sam-app-MyStateMac… │
│   stateMachineArn: arn:aws:states:us-east-1:840541460064:sta… │
│   status: ACTIVE                                              │
│   tracingConfiguration:                                       │
│     enabled: false                                            │
│   type: STANDARD                                              │
│   tags:                                                       │
│     - key: aws:cloudformation:logical-id                      │
│       value: StateMachinetoDDB                                │
│     - key: aws:cloudformation:stack-id                        │
│       value: arn:aws:cloudformation:us-east-1:840541460064:s… │
│     - key: aws:cloudformation:stack-name                      │
│       value: sam-app                                          │
│     - key: stateMachine:createdBy                             │
│       value: SAM                                              │
│                                                               │
└───────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────┐
│ aws                                                          │
├─────────────────────────────┬────────────────────────────────┤
│ StepFunctions::StateMachine │ StateMachinetoDDB-OZxx41bNDei3 │
└─────────────────────────────┴────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t StateMachine" executed in 4s, 162 MB
```
