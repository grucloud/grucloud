---
id: JobDefinition
title: Job Definition
---

Manages a [Batch Job Definition](https://console.aws.amazon.com/batch/home#job-definition).

## Sample code

```js
exports.createResources = () => [
  {
    type: "JobDefinition",
    group: "Batch",
    properties: ({}) => ({
      containerProperties: {
        command: ["echo", "hello grucloud"],
        fargatePlatformConfiguration: {
          platformVersion: "1.4.0",
        },
        image: "public.ecr.aws/amazonlinux/amazonlinux:latest",
        resourceRequirements: [
          {
            type: "VCPU",
            value: "1",
          },
          {
            type: "MEMORY",
            value: "2048",
          },
        ],
      },
      jobDefinitionName: "job-definition",
      platformCapabilities: ["FARGATE"],
      type: "container",
    }),
    dependencies: ({}) => ({
      roleExecution: "role-execution-batch",
    }),
  },
];
```

## Properties

- [RegisterJobDefinitionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-batch/interfaces/registerjobdefinitioncommandinput.html)

## Dependencies

- [EFS FileSystem](../EFS/FileSystem.md)
- [IAM Role](../IAM/Role.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

## Used By

## Full Examples

- [batch simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Batch/batch-simple)

## List

```sh
gc l -t Batch::JobDefinition
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 6 Batch::JobDefinition from aws                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: job-definition                                                       │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   containerProperties:                                                     │
│     command:                                                               │
│       - "echo"                                                             │
│       - "hello grucloud"                                                   │
│     executionRoleArn: arn:aws:iam::840541460064:role/role-execution-batch  │
│     fargatePlatformConfiguration:                                          │
│       platformVersion: 1.4.0                                               │
│     image: public.ecr.aws/amazonlinux/amazonlinux:latest                   │
│     networkConfiguration:                                                  │
│       assignPublicIp: DISABLED                                             │
│     resourceRequirements:                                                  │
│       - type: VCPU                                                         │
│         value: 1                                                           │
│       - type: MEMORY                                                       │
│         value: 2048                                                        │
│   jobDefinitionArn: arn:aws:batch:us-east-1:840541460064:job-definition/j… │
│   jobDefinitionName: job-definition                                        │
│   platformCapabilities:                                                    │
│     - "FARGATE"                                                            │
│   propagateTags: false                                                     │
│   revision: 6                                                              │
│   status: INACTIVE                                                         │
│   tags:                                                                    │
│     gc-managed-by: grucloud                                                │
│     gc-project-name: batch-simple                                          │
│     gc-stage: dev                                                          │
│     gc-created-by-provider: aws                                            │
│     Name: job-definition                                                   │
│   type: container                                                          │
│   latest: true                                                             │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: job-definition::1                                                    │
│ managedByUs: NO                                                            │
│ live:                                                                      │
│   containerProperties:                                                     │
│     command:                                                               │
│       - "echo"                                                             │
│       - "hello world"                                                      │
│     executionRoleArn: arn:aws:iam::840541460064:role/role-execution-batch  │
│     fargatePlatformConfiguration:                                          │
│       platformVersion: 1.4.0                                               │
│     image: public.ecr.aws/amazonlinux/amazonlinux:latest                   │
│     networkConfiguration:                                                  │
│       assignPublicIp: DISABLED                                             │
│     resourceRequirements:                                                  │
│       - type: VCPU                                                         │
│         value: 1                                                           │
│       - type: MEMORY                                                       │
│         value: 2048                                                        │
│   jobDefinitionArn: arn:aws:batch:us-east-1:840541460064:job-definition/j… │
│   jobDefinitionName: job-definition                                        │
│   platformCapabilities:                                                    │
│     - "FARGATE"                                                            │
│   propagateTags: false                                                     │
│   revision: 1                                                              │
│   status: INACTIVE                                                         │
│   tags:                                                                    │
│   type: container                                                          │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├──────────────────────┬────────────────────────────────────────────────────┤
│ Batch::JobDefinition │ job-definition                                     │
│                      │ job-definition::1                                  │
│                      │ job-definition::2                                  │
│                      │ job-definition::3                                  │
│                      │ job-definition::4                                  │
│                      │ job-definition::5                                  │
└──────────────────────┴────────────────────────────────────────────────────┘
6 resources, 1 type, 1 provider
Command "gc l -t Batch::JobDefinition" executed in 2s, 101 MB
```
