---
id: ReadinessCheck
title: Readiness Check
---

Provides [Route53 Recovery Readiness Recovery Group](https://us-west-2.console.aws.amazon.com/route53recovery/home#/readiness/home)

## Examples

```js
exports.createResources = () => [];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53RecoveryReadiness/route53-recovery-readiness)

## Properties

- [CreateReadinessCheckCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53-recovery-readiness/interfaces/createreadinesscheckcommandinput.html)

## Dependencies

- [Resource Set](./ResourceSet.md)

## Used By

## List

List the endpoints with the **Route53RecoveryReadiness::ReadinessCheck** filter:

```sh
gc list -t Route53RecoveryReadiness::ReadinessCheck
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 Route53RecoveryReadiness::ReadinessCheck from aws                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: dynamodb                                                                  │
│ managedByUs: Yes                                                                │
│ live:                                                                           │
│   ReadinessCheckArn: arn:aws:route53-recovery-readiness::840541460064:readines… │
│   ReadinessCheckName: dynamodb                                                  │
│   ResourceSet: dynamodb                                                         │
│   Tags:                                                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├──────────────────────────────────────────┬─────────────────────────────────────┤
│ Route53RecoveryReadiness::ReadinessCheck │ dynamodb                            │
└──────────────────────────────────────────┴─────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53RecoveryReadiness::ReadinessCheck" executed in 5s, 111 MB
```
