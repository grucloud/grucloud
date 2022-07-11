---
id: RoutingControl
title: Routing Control
---

Provides [Route53 Recovery Control Config Routing Control](https://us-west-2.console.aws.amazon.com/route53recovery/home#/recovery-control/home)

## Examples

```js
exports.createResources = () => [
  {
    type: "RoutingControl",
    group: "Route53RecoveryControlConfig",
    properties: ({}) => ({
      RoutingControlName: "RoutingControlCell1",
    }),
    dependencies: ({}) => ({
      controlPanel: "control-panel",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryControlConfig/route53-recovery-control-config)

## Properties

- [CreateRoutingControlCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-control-config/interfaces/createroutingcontrolcommandinput.html)

## Dependencies

- [Control Panel](./ControlPanel.md)

## Used By

## List

List the endpoints with the **Route53RecoveryControlConfig::RoutingControl** filter:

```sh
gc list -t Route53RecoveryControlConfig::RoutingControl
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────┐
│ 2 Route53RecoveryControlConfig::RoutingControl from aws                   │
├───────────────────────────────────────────────────────────────────────────┤
│ name: RoutingControlCell1                                                 │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   RoutingControlName: RoutingControlCell1                                 │
│   ControlPanelArn: arn:aws:route53-recovery-control::840541460064:contro… │
│   RoutingControlArn: arn:aws:route53-recovery-control::840541460064:cont… │
│   Status: DEPLOYED                                                        │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: RoutingControlCell2                                                 │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   RoutingControlName: RoutingControlCell2                                 │
│   ControlPanelArn: arn:aws:route53-recovery-control::840541460064:contro… │
│   RoutingControlArn: arn:aws:route53-recovery-control::840541460064:cont… │
│   Status: DEPLOYED                                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────────────────────────────────┬───────────────────────────┤
│ Route53RecoveryControlConfig::RoutingControl │ RoutingControlCell1       │
│                                              │ RoutingControlCell2       │
└──────────────────────────────────────────────┴───────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc list -t Route53RecoveryControlConfig::RoutingControl" executed in 6s, 116 MB

```
