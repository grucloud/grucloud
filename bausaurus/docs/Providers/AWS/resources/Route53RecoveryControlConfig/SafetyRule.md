---
id: SafetyRule
title: Safety Rule
---

Provides [Route53 Recovery Control Config Safety Rule](https://us-west-2.console.aws.amazon.com/route53recovery/home#/dashboard)

## Examples

```js
exports.createResources = () => [
  {
    type: "SafetyRule",
    group: "Route53RecoveryControlConfig",
    properties: ({ getId }) => ({
      AssertionRule: {
        AssertedControls: [
          `${getId({
            type: "RoutingControl",
            group: "Route53RecoveryControlConfig",
            name: "RoutingControlCell1",
          })}`,
          `${getId({
            type: "RoutingControl",
            group: "Route53RecoveryControlConfig",
            name: "RoutingControlCell2",
          })}`,
        ],
        ControlPanelArn: `${getId({
          type: "ControlPanel",
          group: "Route53RecoveryControlConfig",
          name: "control-panel",
        })}`,
        Name: "SafetyRuleMinCellsActive",
        RuleConfig: {
          Inverted: true,
          Threshold: 1,
          Type: "ATLEAST",
        },
        WaitPeriodMs: 5000,
      },
    }),
    dependencies: ({}) => ({
      controlPanel: "control-panel",
      routingControls: ["RoutingControlCell1", "RoutingControlCell2"],
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryControlConfig/route53-recovery-control-config)

## Properties

- [CreateSafetyRuleCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-control-config/interfaces/createsafetyrulecommandinput.html)

## Dependencies

- [Control Panel](./ControlPanel.md)
- [Routing Control](./RoutingControl.md)

## Used By

## List

List the endpoints with the **Route53RecoveryControlConfig::SafetyRule** filter:

```sh
gc list -t Route53RecoveryControlConfig::SafetyRule
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 Route53RecoveryControlConfig::SafetyRule from aws                       │
├───────────────────────────────────────────────────────────────────────────┤
│ name: SafetyRuleMinCellsActive                                            │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   AssertionRule:                                                          │
│     AssertedControls:                                                     │
│       - "arn:aws:route53-recovery-control::840541460064:controlpanel/0ad… │
│       - "arn:aws:route53-recovery-control::840541460064:controlpanel/0ad… │
│     ControlPanelArn: arn:aws:route53-recovery-control::840541460064:cont… │
│     Name: SafetyRuleMinCellsActive                                        │
│     RuleConfig:                                                           │
│       Inverted: true                                                      │
│       Threshold: 1                                                        │
│       Type: ATLEAST                                                       │
│     SafetyRuleArn: arn:aws:route53-recovery-control::840541460064:contro… │
│     Status: DEPLOYED                                                      │
│     WaitPeriodMs: 5000                                                    │
│   Tags:                                                                   │
│     gc-managed-by: grucloud                                               │
│     gc-project-name: route53-recovery-control-config                      │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     Name: SafetyRuleMinCellsActive                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────────────────────────────┬───────────────────────────────┤
│ Route53RecoveryControlConfig::SafetyRule │ SafetyRuleMinCellsActive      │
└──────────────────────────────────────────┴───────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53RecoveryControlConfig::SafetyRule" executed in 6s, 117 MB

```
