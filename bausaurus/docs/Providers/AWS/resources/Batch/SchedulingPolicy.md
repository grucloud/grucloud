---
id: SchedulingPolicy
title: Scheduling Policy
---

Manages a [Batch Scheduling Policy](https://console.aws.amazon.com/batch/home#schedulingPolicies).

## Sample code

```js
exports.createResources = () => [
  {
    type: "SchedulingPolicy",
    group: "Batch",
    properties: ({}) => ({
      fairsharePolicy: {
        computeReservation: 0,
        shareDecaySeconds: 0,
        shareDistribution: [],
      },
      name: "my-scheduling-policy",
    }),
  },
];
```

## Properties

- [CreateSchedulingPolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-batch/interfaces/createschedulingpolicycommandinput.html)

## Dependencies

## Used By

- [Batch Job Queue](./JobQueue.md)

## Full Examples

- [batch simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Batch/batch-simple)

## List

```sh
gc l -t Batch::SchedulingPolicy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 Batch::SchedulingPolicy from aws                                         │
├────────────────────────────────────────────────────────────────────────────┤
│ name: my-scheduling-policy                                                 │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   arn: arn:aws:batch:us-east-1:840541460064:scheduling-policy/my-scheduli… │
│   fairsharePolicy:                                                         │
│     computeReservation: 0                                                  │
│     shareDecaySeconds: 0                                                   │
│     shareDistribution: []                                                  │
│   name: my-scheduling-policy                                               │
│   tags:                                                                    │
│     gc-managed-by: grucloud                                                │
│     gc-project-name: batch-simple                                          │
│     gc-stage: dev                                                          │
│     gc-created-by-provider: aws                                            │
│     Name: my-scheduling-policy                                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├─────────────────────────┬─────────────────────────────────────────────────┤
│ Batch::SchedulingPolicy │ my-scheduling-policy                            │
└─────────────────────────┴─────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Batch::SchedulingPolicy" executed in 2s, 99 MB
```
