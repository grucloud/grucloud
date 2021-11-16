---
id: DBSubnetGroup
title: DB Subnet Group
---

Manages a [DB Subnet Group](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html).

## Example

```js
const dbSubnetGroup = provider.RDS.makeDBSubnetGroup({
  name: "db-subnet-group",
  dependencies: { subnets: [subnetA, subnetB] },
  properties: () => ({ DBSubnetGroupDescription: "db subnet group" }),
});
```

## Code Examples

- [stateless postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/rds/iac.js)

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
  ✓ Listing 7/7
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│ 1 DBSubnetGrou… │                                                                        │
├─────────────────┼─────────────────────────────────────────────────────────────────┬──────┤
│ Name            │ Data                                                            │ Our  │
├─────────────────┼─────────────────────────────────────────────────────────────────┼──────┤
│ db-subnet-group │ DBSubnetGroupName: db-subnet-group                              │ Yes  │
│                 │ DBSubnetGroupDescription: db subnet group                       │      │
│                 │ VpcId: vpc-00adc8aa058c195e0                                    │      │
│                 │ SubnetGroupStatus: Complete                                     │      │
│                 │ Subnets:                                                        │      │
│                 │   - SubnetIdentifier: subnet-0a6789c65e6cad43a                  │      │
│                 │     SubnetAvailabilityZone:                                     │      │
│                 │       Name: eu-west-2b                                          │      │
│                 │     SubnetOutpost:                                              │      │
│                 │     SubnetStatus: Active                                        │      │
│                 │   - SubnetIdentifier: subnet-0c54f4e32ff2723b8                  │      │
│                 │     SubnetAvailabilityZone:                                     │      │
│                 │       Name: eu-west-2a                                          │      │
│                 │     SubnetOutpost:                                              │      │
│                 │     SubnetStatus: Active                                        │      │
│                 │ DBSubnetGroupArn: arn:aws:rds:eu-west-2:840541460064:subgrp:db… │      │
│                 │ Tags:                                                           │      │
│                 │   - Key: ManagedBy                                              │      │
│                 │     Value: GruCloud                                             │      │
│                 │   - Key: stage                                                  │      │
│                 │     Value: dev                                                  │      │
│                 │   - Key: projectName                                            │      │
│                 │     Value: rds-example                                          │      │
│                 │   - Key: CreatedByProvider                                      │      │
│                 │     Value: aws                                                  │      │
│                 │   - Key: Name                                                   │      │
│                 │     Value: db-subnet-group                                      │      │
│                 │                                                                 │      │
└─────────────────┴─────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├────────────────────┬────────────────────────────────────────────────────────────────────┤
│ DBSubnetGroup      │ db-subnet-group                                                    │
└────────────────────┴────────────────────────────────────────────────────────────────────┘
1 resource, 4 types, 1 provider
Command "gc l -t DBSubnetGroup" executed in 3s
```
