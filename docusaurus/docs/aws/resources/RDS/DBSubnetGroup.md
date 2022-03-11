---
id: DBSubnetGroup
title: DB Subnet Group
---

Manages a [DB Subnet Group](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html).

## Example

```js
exports.createResources = () => [
  {
    type: "DBSubnetGroup",
    group: "RDS",
    name: "subnet-group-postgres",
    properties: ({}) => ({
      DBSubnetGroupDescription: "db subnet group",
    }),
    dependencies: () => ({
      subnets: ["subnet-1", "subnet-2"],
    }),
  },
];
```

## Code Examples

- [stateless postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres-stateless)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSubnetGroup-property)

## Used By

- [DB Cluster](./DBCluster.md)

## List

```sh
gc l -t DBSubnetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────┐
│ 1 RDS::DBSubnetGroup from aws                                          │
├────────────────────────────────────────────────────────────────────────┤
│ name: subnet-group-postgres                                            │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   DBSubnetGroupName: subnet-group-postgres                             │
│   DBSubnetGroupDescription: db subnet group                            │
│   VpcId: vpc-0d5b0c96f249946d7                                         │
│   SubnetGroupStatus: Complete                                          │
│   Subnets:                                                             │
│     - SubnetIdentifier: subnet-0ffb0ef569d4a8716                       │
│       SubnetAvailabilityZone:                                          │
│         Name: us-east-1a                                               │
│       SubnetOutpost:                                                   │
│       SubnetStatus: Active                                             │
│     - SubnetIdentifier: subnet-0fa8cee733fa0d508                       │
│       SubnetAvailabilityZone:                                          │
│         Name: us-east-1b                                               │
│       SubnetOutpost:                                                   │
│       SubnetStatus: Active                                             │
│   DBSubnetGroupArn: arn:aws:rds:us-east-1:840541460064:subgrp:subnet-… │
│   Tags:                                                                │
│     - Key: gc-created-by-provider                                      │
│       Value: aws                                                       │
│     - Key: gc-managed-by                                               │
│       Value: grucloud                                                  │
│     - Key: gc-project-name                                             │
│       Value: @grucloud/example-aws-rds-postgres                        │
│     - Key: gc-stage                                                    │
│       Value: dev                                                       │
│     - Key: mykey2                                                      │
│       Value: myvalue                                                   │
│     - Key: Name                                                        │
│       Value: subnet-group-postgres                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├────────────────────┬──────────────────────────────────────────────────┤
│ RDS::DBSubnetGroup │ subnet-group-postgres                            │
└────────────────────┴──────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t DBSubnetGroup" executed in 4s, 216 MB
```
