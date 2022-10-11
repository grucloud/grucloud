---
id: ClusterSubnetGroup
title: Cluster Subnet Group
---

Manages a [Redshift Cluster Subnet Group](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html).

## Example

```js
exports.createResources = () => [
  {
    type: "ClusterSubnetGroup",
    group: "Redshift",
    properties: ({}) => ({
      ClusterSubnetGroupName: "cluster-subnet-group-1",
      Description: "cluster-subnet-group-1",
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

- [redshift simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Redshift/redshift-simple)

## Properties

- [CreateClusterSubnetGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-redshift/interfaces/createclustersubnetgroupcommandinput.html)

## Used By

- [Redshift Cluster](./Cluster.md)

## List

```sh
gc l -t ClusterSubnetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Redshift::ClusterSubnetGroup from aws                                           │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: cluster-subnet-group-1                                                      │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   ClusterSubnetGroupName: cluster-subnet-group-1                                  │
│   Description: cluster-subnet-group-1                                             │
│   VpcId: vpc-0d760bcfee953174e                                                    │
│   SubnetGroupStatus: Complete                                                     │
│   Subnets:                                                                        │
│     - SubnetIdentifier: subnet-0e9bc4ac2c7ea6e7a                                  │
│       SubnetAvailabilityZone:                                                     │
│         Name: us-east-1b                                                          │
│       SubnetStatus: Active                                                        │
│     - SubnetIdentifier: subnet-0c58020a74fe0b938                                  │
│       SubnetAvailabilityZone:                                                     │
│         Name: us-east-1a                                                          │
│       SubnetStatus: Active                                                        │
│   Tags:                                                                           │
│     - Key: gc-created-by-provider                                                 │
│       Value: aws                                                                  │
│     - Key: gc-managed-by                                                          │
│       Value: grucloud                                                             │
│     - Key: gc-project-name                                                        │
│       Value: redshift-simple                                                      │
│     - Key: gc-stage                                                               │
│       Value: dev                                                                  │
│     - Key: Name                                                                   │
│       Value: cluster-subnet-group-1                                               │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├──────────────────────────────┬───────────────────────────────────────────────────┤
│ Redshift::ClusterSubnetGroup │ cluster-subnet-group-1                            │
└──────────────────────────────┴───────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ClusterSubnetGroup" executed in 3s, 98 MB
```
