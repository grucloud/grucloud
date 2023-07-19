---
id: Target
title: Target
---

Manages a [CloudWatch Event Target](https://console.aws.amazon.com/events/home?#/rules).

## Sample code

### Target to an SQS Queue

```js
exports.createResources = () => [
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "S3NewImageEvent",
    }),
    dependencies: () => ({
      rule: "sam-app-S3NewImageEvent",
      sqsQueue: "sam-app-NewImageEventQueue",
    }),
  },
];
```

### Target to a StepFunction State Machine

```js
exports.createResources = () => [
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "terraform-20220331194525125100000008",
    }),
    dependencies: () => ({
      rule: "terraform-20220331194511828000000002",
      role: "terraform-20220331194511828200000005",
      sfnStateMachine: "eventbridge-state-machine-demo",
    }),
  },
];
```

### Target to a Log Group

```js
exports.createResources = () => [
  {
    type: "Target",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Id: "CloudWatchLogTarget",
    }),
    dependencies: () => ({
      rule: "sam-app-EventBusLogRule",
      logGroup: "/aws/events/sam-app",
    }),
  },
];
```

## Properties

- [PutTargetsRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-events/modules/puttargetsrequest.html)

## Dependencies

- [APIGateway RestApi](../APIGateway/RestApi.md)
- [CloudWatchEvents EventBus](../CloudWatchEvents/EventBus.md)
- [CloudWatchEvents Rule](../CloudWatchEvents/Rule.md)
- [CloudWatchEvent Api Destination](../CloudWatchEvents/ApiDestination.md)
- [CloudWatchLogs Log Group](../CloudWatchLogs/LogGroup.md)
- [CodeBuild Project](../CodeBuild/Project.md)
- [CodePipeline Pipeline](../CodePipeline/Pipeline.md)
- [ECS Task](../ECS/Task.md)
- [IAM Role](../IAM/Role.md)
- [Lambda Function](../Lambda/Function.md)
- [SQS Queue](../SQS/Queue.md)
- [SNS Topic](../SNS/Topic.md)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchEvent/event)
- [s3-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/S3/s3-eventbridge)
- [eventbridge-sfn-terraform](https://github.com/grucloud/grucloud/tree/main/examples/aws/S3/serverless-patterns/eventbridge-sfn-terraform)
- [sfn-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/S3/serverless-patterns/sfn-eventbridge)

## List

The rules can be filtered with the _CloudWatchEvents::Target_ type:

```sh
gc l -t CloudWatchEvents::Target
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatchEvents::Target from aws                                   │
├───────────────────────────────────────────────────────────────────────┤
│ name: target::AutoScalingManagedRule::autoscaling                     │
│ managedByUs: NO                                                       │
│ live:                                                                 │
│   Arn: arn:aws:autoscaling:us-east-1:::                               │
│   Id: autoscaling                                                     │
│   Rule: AutoScalingManagedRule                                        │
│   EventBusName: default                                               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├──────────────────────────┬───────────────────────────────────────────┤
│ CloudWatchEvents::Target │ target::AutoScalingManagedRule::autoscal… │
└──────────────────────────┴───────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatchEvents::Target" executed in 5s, 170 MB
```
