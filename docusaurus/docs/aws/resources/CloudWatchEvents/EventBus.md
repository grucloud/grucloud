---
id: EventBus
title: EventBus
---

Manages an Event Bridge [Event Bus](https://console.aws.amazon.com/events/home?#/eventbuses).

## Sample code

```js
exports.createResources = () => [
  { type: "EventBus", group: "CloudWatchEvents", name: "bus-test" },
];
```

## Properties

- [CreateEventBusCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-events/interfaces/createeventbuscommandinput.html)

## Used By

- [Rule](./Rule.md)
- [ApiGatewayV2 Integration](../ApiGatewayV2/Integration.md)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchEvent/event)

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
