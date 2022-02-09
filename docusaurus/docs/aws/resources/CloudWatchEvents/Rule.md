---
id: Rule
title: Rule
---

Manages an Event Bridge [Rule](https://console.aws.amazon.com/events/home?#/rules).

## Sample code

```js
exports.createResources = () => [
  { type: "EventBus", group: "CloudWatchEvents", name: "bus-test" },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "rule-test",
    properties: ({}) => ({
      EventPattern:
        '{"source":["aws.ec2"],"detail-type":["EC2 Instance State-change Notification"]}',
      State: "ENABLED",
      Description: "testing rule",
    }),
  },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "rule-test-ec2",
    properties: ({}) => ({
      EventPattern:
        '{"source":["aws.acm"],"detail-type":["ACM Certificate Approaching Expiration"]}',
      State: "ENABLED",
    }),
    dependencies: () => ({
      eventBus: "bus-test",
    }),
  },
];
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property)

## Dependencies

- [Event Bus](./EventBus.md)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/cloudWatchEvent/event)

## List

The rules can be filtered with the _CloudWatchEvents::Rule_ type:

```sh
gc l -t CloudWatchEvents::Rule
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 15/15
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3 CloudWatchEvents::Rule from aws                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: AutoScalingManagedRule                                                │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   Name: AutoScalingManagedRule                                              │
│   Arn: arn:aws:events:eu-west-2:840541460064:rule/AutoScalingManagedRule    │
│   EventPattern: {"source":["aws.ec2"],"detail-type":["EC2 Instance Rebalan… │
│   State: ENABLED                                                            │
│   Description: This rule is used to route Instance notifications to EC2 Au… │
│   ManagedBy: autoscaling.amazonaws.com                                      │
│   EventBusName: default                                                     │
│   Tags: []                                                                  │
│   Targets:                                                                  │
│     - Id: autoscaling                                                       │
│       Arn: arn:aws:autoscaling:eu-west-2:::                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule-test                                                             │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   Name: rule-test                                                           │
│   Arn: arn:aws:events:eu-west-2:840541460064:rule/rule-test                 │
│   EventPattern: {"source":["aws.ec2"],"detail-type":["EC2 Instance State-c… │
│   State: ENABLED                                                            │
│   Description: testing rule updated                                         │
│   EventBusName: default                                                     │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: aws-example-cloudwatchevent                                    │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: rule-test                                                      │
│   Targets: []                                                               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: rule-test-ec2                                                         │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   Name: rule-test-ec2                                                       │
│   Arn: arn:aws:events:eu-west-2:840541460064:rule/bus-test/rule-test-ec2    │
│   EventPattern: {"source":["aws.acm"],"detail-type":["ACM Certificate Appr… │
│   State: ENABLED                                                            │
│   EventBusName: bus-test                                                    │
│   Targets: []                                                               │
│   Tags:                                                                     │
│     - Key: gc-created-by-provider                                           │
│       Value: aws                                                            │
│     - Key: gc-managed-by                                                    │
│       Value: grucloud                                                       │
│     - Key: gc-project-name                                                  │
│       Value: aws-example-cloudwatchevent                                    │
│     - Key: gc-stage                                                         │
│       Value: dev                                                            │
│     - Key: Name                                                             │
│       Value: rule-test-ec2                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├────────────────────────────────┬───────────────────────────────────────┤
│ CloudWatchEvents::Rule         │ AutoScalingManagedRule                │
│                                │ rule-test                             │
│                                │ rule-test-ec2                         │
└────────────────────────────────┴───────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t Rule" executed in 12s
```
