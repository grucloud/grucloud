---
id: RecoveryGroup
title: Recovery Group
---

Provides [Route53 Recovery Readiness Recovery Group](https://us-west-2.console.aws.amazon.com/route53recovery/home#/readiness/home)

## Examples

```js
exports.createResources = () => [
  {
    type: "RecoveryGroup",
    group: "Route53RecoveryReadiness",
    properties: ({}) => ({
      RecoveryGroupName: "my-recoverygroup",
    }),
    dependencies: ({}) => ({
      cells: ["my-recoverygroup-cell1", "my-recoverygroup-cell2"],
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryReadiness/route53-recovery-readiness)

## Properties

- [CreateRecoveryGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-readiness/interfaces/createrecoverygroupcommandinput.html)

## Dependencies

- [Cell](./Cell.md)

## Used By

## List

List the endpoints with the **Route53RecoveryReadiness::RecoveryGroup** filter:

```sh
gc list -t Route53RecoveryReadiness::RecoveryGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 Route53RecoveryReadiness::RecoveryGroup from aws                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-recoverygroup                                                              │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   Cells:                                                                            │
│     - "arn:aws:route53-recovery-readiness::840541460064:cell/my-recoverygroup-cell… │
│     - "arn:aws:route53-recovery-readiness::840541460064:cell/my-recoverygroup-cell… │
│   RecoveryGroupArn: arn:aws:route53-recovery-readiness::840541460064:recovery-grou… │
│   RecoveryGroupName: my-recoverygroup                                               │
│   Tags:                                                                             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├─────────────────────────────────────────┬──────────────────────────────────────────┤
│ Route53RecoveryReadiness::RecoveryGroup │ my-recoverygroup                         │
└─────────────────────────────────────────┴──────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53RecoveryReadiness::RecoveryGroup" executed in 4s, 109 MB
```
