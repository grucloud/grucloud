---
id: EventBus
title: EventBus
---

Manages an Event Bridge [Event Bus](https://console.aws.amazon.com/events/home?#/eventbuses).

## Sample code

```js
provider.CloudWatchEvents.makeEventBus({
  name: "my-event-bus",
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#createEventBus-property)

## Used By

- [Rule](./CloudWatchEventRule)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/cloudWatchEvent/event)

## List

The event buses can be filtered with the _EventBus_ type:

```sh
gc l -t EventBus
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2 CloudWatchEvents::EventBus from aws                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: bus-test                                                              │
│ managedByUs: Yes                                                            │
│ live:                                                                       │
│   Name: bus-test                                                            │
│   Arn: arn:aws:events:eu-west-2:840541460064:event-bus/bus-test             │
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
│       Value: bus-test                                                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                               │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   Name: default                                                             │
│   Arn: arn:aws:events:eu-west-2:840541460064:event-bus/default              │
│   Tags: []                                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├────────────────────────────────┬───────────────────────────────────────┤
│ CloudWatchEvents::EventBus     │ bus-test                              │
│                                │ default                               │
└────────────────────────────────┴───────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EventBus" executed in 5s
```
