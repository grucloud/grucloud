---
id: SubnetGroup
title: SubnetGroup
---

Manages a [MemoryDB Parameter Group](https://console.aws.amazon.com/memorydb/home?#/subnet-groups).

## Example

```js
exports.createResources = () => [
  {
    type: "SubnetGroup",
    group: "MemoryDB",
    properties: ({}) => ({
      Name: "subnet-group",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
];
```

## Code Examples

- [memorydb simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple)

## Properties

- [CreateSubnetGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createparametergroupcommandinput.html)

## Dependencies

- [EC2 Subnet](../EC2/Cluster.md)

## Used By

- [MemoryDB Cluster](./Cluster.md)

## List

```sh
gc l -t MemoryDB::SubnetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 MemoryDB::SubnetGroup from aws                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ name: subnet-group                                                       │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:subnetgroup/subnet-group  │
│   Name: subnet-group                                                     │
│   Subnets:                                                               │
│     - AvailabilityZone:                                                  │
│         Name: us-east-1b                                                 │
│       Identifier: subnet-081fb38b21bf7a0b9                               │
│     - AvailabilityZone:                                                  │
│         Name: us-east-1a                                                 │
│       Identifier: subnet-07ef46c6dd78c2ebd                               │
│   VpcId: vpc-043cc512c461b8a0b                                           │
│   Tags:                                                                  │
│     - Key: gc-created-by-provider                                        │
│       Value: aws                                                         │
│     - Key: gc-managed-by                                                 │
│       Value: grucloud                                                    │
│     - Key: gc-project-name                                               │
│       Value: memorydb-simple                                             │
│     - Key: gc-stage                                                      │
│       Value: dev                                                         │
│     - Key: Name                                                          │
│       Value: subnet-group                                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────┬─────────────────────────────────────────────────┤
│ MemoryDB::SubnetGroup │ subnet-group                                    │
└───────────────────────┴─────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t MemoryDB::SubnetGroup" executed in 3s, 100 MB
```
