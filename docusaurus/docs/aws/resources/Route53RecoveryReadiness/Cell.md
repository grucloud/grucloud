---
id: Cell
title: Cell
---

Provides [Route53 Recovery Readiness Cell](https://us-west-2.console.aws.amazon.com/route53recovery/home#/dashboard)

## Examples

```js
exports.createResources = () => [
  {
    type: "Cell",
    group: "Route53RecoveryReadiness",
    properties: ({}) => ({
      CellName: "my-recoverygroup-cell1",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryReadiness/route53-recovery-readiness)

## Properties

- [CreateCellCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-readiness/interfaces/createcellcommandinput.html)

## Dependencies

## Used By

- [RecoveryGroup](./RecoveryGroup.md)

## List

List the endpoints with the **Route53RecoveryReadiness::Cell** filter:

```sh
gc list -t Route53RecoveryReadiness::Cell
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 2 Route53RecoveryReadiness::Cell from aws                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-recoverygroup-cell1                                                        │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   CellArn: arn:aws:route53-recovery-readiness::840541460064:cell/my-recoverygroup-… │
│   CellName: my-recoverygroup-cell1                                                  │
│   Cells: []                                                                         │
│   ParentReadinessScopes:                                                            │
│     - "arn:aws:route53-recovery-readiness::840541460064:recovery-group/my-recovery… │
│   Tags:                                                                             │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-recoverygroup-cell2                                                        │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   CellArn: arn:aws:route53-recovery-readiness::840541460064:cell/my-recoverygroup-… │
│   CellName: my-recoverygroup-cell2                                                  │
│   Cells: []                                                                         │
│   ParentReadinessScopes:                                                            │
│     - "arn:aws:route53-recovery-readiness::840541460064:recovery-group/my-recovery… │
│   Tags:                                                                             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├────────────────────────────────┬───────────────────────────────────────────────────┤
│ Route53RecoveryReadiness::Cell │ my-recoverygroup-cell1                            │
│                                │ my-recoverygroup-cell2                            │
└────────────────────────────────┴───────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc list -t Route53RecoveryReadiness::Cell" executed in 5s, 116 MB
```
