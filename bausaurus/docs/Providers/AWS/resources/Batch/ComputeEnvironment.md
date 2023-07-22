---
id: ComputeEnvironment
title: Compute Environment
---

Manages a [Batch Compute Environment](https://console.aws.amazon.com/batch/home#compute-environments).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ComputeEnvironment",
    group: "Batch",
    properties: ({ config }) => ({
      computeEnvironmentName: "compute-environment",
      computeResources: {
        maxvCpus: 256,
        type: "FARGATE",
      },
      serviceRole: `arn:aws:iam::${config.accountId()}:role/aws-service-role/batch.amazonaws.com/AWSServiceRoleForBatch`,
      type: "MANAGED",
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::vpc-default::default"],
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
      ],
    }),
  },
];
```

## Properties

- [CreateComputeEnvironmentCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-batch/interfaces/createcomputeenvironmentcommandinput.html)

## Dependencies

- [EKS Cluster](../EKS/Cluster.md)
- [EC2 Launch Template](../EC2/LaunchTemplate.md)
- [EC2 Placement Group](../EC2/PlacementGroup.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)
- [IAM Role](../IAM/Role.md)

## Used By

- [Batch Job Queue](./JobQueue.md)

## Full Examples

- [batch simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Batch/batch-simple)

## List

```sh
gc l -t Batch::ComputeEnvironment
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1 Batch::ComputeEnvironment from aws                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ name: compute-environment                                                   │
│ managedByUs: NO                                                             │
│ live:                                                                       │
│   computeEnvironmentArn: arn:aws:batch:us-east-1:840541460064:compute-envi… │
│   computeEnvironmentName: compute-environment                               │
│   computeResources:                                                         │
│     ec2Configuration: []                                                    │
│     instanceTypes: []                                                       │
│     maxvCpus: 256                                                           │
│     securityGroupIds:                                                       │
│       - "sg-4e82a670"                                                       │
│     subnets:                                                                │
│       - "subnet-b80a4ff5"                                                   │
│       - "subnet-df1ea980"                                                   │
│     tags:                                                                   │
│     type: FARGATE                                                           │
│   ecsClusterArn: arn:aws:ecs:us-east-1:840541460064:cluster/AWSBatch-compu… │
│   serviceRole: arn:aws:iam::840541460064:role/aws-service-role/batch.amazo… │
│   state: ENABLED                                                            │
│   status: VALID                                                             │
│   statusReason: ComputeEnvironment Healthy                                  │
│   tags:                                                                     │
│   type: MANAGED                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                        │
├───────────────────────────┬────────────────────────────────────────────────┤
│ Batch::ComputeEnvironment │ compute-environment                            │
└───────────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Batch::ComputeEnvironment" executed in 2s, 98 MB
```
