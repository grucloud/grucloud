---
id: JobQueue
title: Job Queue
---

Manages a [Batch Job Queue](https://console.aws.amazon.com/batch/home#queues).

## Sample code

```js
exports.createResources = () => [
  {
    type: "JobQueue",
    group: "Batch",
    properties: ({ getId }) => ({
      computeEnvironmentOrder: [
        {
          computeEnvironment: `${getId({
            type: "ComputeEnvironment",
            group: "Batch",
            name: "compute-environment",
          })}`,
          order: 1,
        },
      ],
      jobQueueName: "my-job-queue",
      priority: 1,
    }),
    dependencies: ({}) => ({
      computeEnvironments: ["compute-environment"],
      schedulingPolicy: "my-scheduling-policy",
    }),
  },
];
```

## Properties

- [CreateJobQueueCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-batch/interfaces/createjobqueuecommandinput.html)

## Dependencies

- [Batch Compute Environment](./ComputeEnvironment.md)
- [Batch Scheduling Policy](./SchedulingPolicy.md)

## Used By

## Full Examples

- [batch simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Batch/batch-simple)

## List

```sh
gc l -t Batch::JobQueue
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 1 Batch::JobQueue from aws                                                 │
├────────────────────────────────────────────────────────────────────────────┤
│ name: my-job-queue                                                         │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   computeEnvironmentOrder:                                                 │
│     - computeEnvironment: arn:aws:batch:us-east-1:840541460064:compute-en… │
│       order: 1                                                             │
│   jobQueueArn: arn:aws:batch:us-east-1:840541460064:job-queue/my-job-queue │
│   jobQueueName: my-job-queue                                               │
│   priority: 1                                                              │
│   schedulingPolicyArn: arn:aws:batch:us-east-1:840541460064:scheduling-po… │
│   state: ENABLED                                                           │
│   status: VALID                                                            │
│   statusReason: JobQueue Healthy                                           │
│   tags:                                                                    │
│     gc-managed-by: grucloud                                                │
│     gc-project-name: batch-simple                                          │
│     gc-stage: dev                                                          │
│     gc-created-by-provider: aws                                            │
│     Name: my-job-queue                                                     │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├─────────────────┬─────────────────────────────────────────────────────────┤
│ Batch::JobQueue │ my-job-queue                                            │
└─────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Batch::JobQueue" executed in 2s, 99 MB
```
