---
id: ControlPanel
title: Control Panel
---

Provides [Route53 Recovery Control Config Control Panel](https://us-west-2.console.aws.amazon.com/route53recovery/home#/dashboard)

## Examples

```js
exports.createResources = () => [
  {
    type: "ControlPanel",
    group: "Route53RecoveryControlConfig",
    properties: ({}) => ({
      ControlPanelName: "control-panel",
    }),
    dependencies: ({}) => ({
      cluster: "cluster",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryControlConfig/route53-recovery-control-config)

## Properties

- [CreateControlPanelCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-control-config/interfaces/createcontrolpanelcommandinput.html)

## Dependencies

- [Cluster](./Cluster.md)

## Used By

- [RoutingControl](./RoutingControl.md)

## List

List the endpoints with the **Route53RecoveryControlConfig::ControlPanel** filter:

```sh
gc list -t Route53RecoveryControlConfig::ControlPanel
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────┐
│ 2 Route53RecoveryControlConfig::ControlPanel from aws                     │
├───────────────────────────────────────────────────────────────────────────┤
│ name: control-panel                                                       │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   ControlPanelName: control-panel                                         │
│   ClusterArn: arn:aws:route53-recovery-control::840541460064:cluster/47e… │
│   ControlPanelArn: arn:aws:route53-recovery-control::840541460064:contro… │
│   DefaultControlPanel: false                                              │
│   RoutingControlCount: 2                                                  │
│   Status: DEPLOYED                                                        │
│   Tags:                                                                   │
│     gc-managed-by: grucloud                                               │
│     gc-project-name: route53-recovery-control-config                      │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     Name: control-panel                                                   │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: DefaultControlPanel                                                 │
│ managedByUs: NO                                                           │
│ live:                                                                     │
│   ControlPanelName: DefaultControlPanel                                   │
│   ClusterArn: arn:aws:route53-recovery-control::840541460064:cluster/47e… │
│   ControlPanelArn: arn:aws:route53-recovery-control::840541460064:contro… │
│   DefaultControlPanel: true                                               │
│   RoutingControlCount: 0                                                  │
│   Status: DEPLOYED                                                        │
│   Tags:                                                                   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────────────────────────────┬─────────────────────────────┤
│ Route53RecoveryControlConfig::ControlPanel │ control-panel               │
│                                            │ DefaultControlPanel         │
└────────────────────────────────────────────┴─────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc list -t Route53RecoveryControlConfig::ControlPanel" executed in 6s, 109 MB

```
