---
id: Cluster
title: Cluster
---

Manages a [Redshift Cluster](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html).

## Example

```js
exports.createResources = () => [
  {
    type: "Cluster",
    group: "Redshift",
    properties: ({}) => ({
      ClusterIdentifier: "redshift-cluster-1",
      NodeType: "dc2.large",
      ClusterParameterGroups: [
        {
          ParameterGroupName: "group-1",
        },
      ],
      ClusterSubnetGroupName: "cluster-subnet-group-1",
      NumberOfNodes: 2,
      EnhancedVpcRouting: true,
      TotalStorageCapacityInMegaBytes: 400000,
      MasterUserPassword: process.env.REDSHIFT_CLUSTER_1_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      clusterSubnetGroup: "cluster-subnet-group-1",
      clusterParameterGroups: ["group-1"],
      vpcSecurityGroups: ["sg::vpc::default"],
    }),
  },
];
```

## Code Examples

- [redshift simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Redshift/redshift-simple)

## Properties

- [CreateClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-redshift/interfaces/createclustercommandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [IAM Role](../IAM/Role.md)
- [KMS Key](../KMS/Key.md)
- [Redshift Cluster Subnet Group](./ClusterSubnetGroup.md)

## List

```sh
gc l -t Redshift::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Redshift::Cluster from aws                                                      │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: redshift-cluster-1                                                          │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   ClusterIdentifier: redshift-cluster-1                                           │
│   NodeType: dc2.large                                                             │
│   ClusterStatus: available                                                        │
│   ClusterAvailabilityStatus: Available                                            │
│   MasterUsername: awsuser                                                         │
│   DBName: dev                                                                     │
│   Endpoint:                                                                       │
│     Address: redshift-cluster-1.ck96afkwnpca.us-east-1.redshift.amazonaws.com     │
│     Port: 5439                                                                    │
│   ClusterCreateTime: 2022-10-10T19:42:10.383Z                                     │
│   AutomatedSnapshotRetentionPeriod: 1                                             │
│   ManualSnapshotRetentionPeriod: -1                                               │
│   ClusterSecurityGroups: []                                                       │
│   VpcSecurityGroups:                                                              │
│     - VpcSecurityGroupId: sg-0ff054653b90879a7                                    │
│       Status: active                                                              │
│   ClusterParameterGroups:                                                         │
│     - ParameterGroupName: default.redshift-1.0                                    │
│       ParameterApplyStatus: in-sync                                               │
│   ClusterSubnetGroupName: cluster-subnet-group-1                                  │
│   VpcId: vpc-0d760bcfee953174e                                                    │
│   AvailabilityZone: us-east-1a                                                    │
│   PreferredMaintenanceWindow: wed:04:30-wed:05:00                                 │
│   PendingModifiedValues:                                                          │
│   ClusterVersion: 1.0                                                             │
│   AllowVersionUpgrade: true                                                       │
│   NumberOfNodes: 2                                                                │
│   PubliclyAccessible: false                                                       │
│   Encrypted: false                                                                │
│   ClusterPublicKey: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCgevle0Nu2lIbPdSNJPi7i… │
│                                                                                   │
│   ClusterNodes:                                                                   │
│     - NodeRole: LEADER                                                            │
│       PrivateIPAddress: 10.0.141.9                                                │
│     - NodeRole: COMPUTE-0                                                         │
│       PrivateIPAddress: 10.0.142.229                                              │
│     - NodeRole: COMPUTE-1                                                         │
│       PrivateIPAddress: 10.0.133.48                                               │
│   ClusterRevisionNumber: 41881                                                    │
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
│       Value: redshift-cluster-1                                                   │
│   EnhancedVpcRouting: true                                                        │
│   IamRoles: []                                                                    │
│   MaintenanceTrackName: current                                                   │
│   ElasticResizeNumberOfNodeOptions: [4]                                           │
│   DeferredMaintenanceWindows: []                                                  │
│   NextMaintenanceWindowStartTime: 2022-10-12T04:30:00.000Z                        │
│   AvailabilityZoneRelocationStatus: disabled                                      │
│   ClusterNamespaceArn: arn:aws:redshift:us-east-1:840541460064:namespace:70d80ac… │
│   AquaConfiguration:                                                              │
│     AquaStatus: disabled                                                          │
│     AquaConfigurationStatus: auto                                                 │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├───────────────────┬──────────────────────────────────────────────────────────────┤
│ Redshift::Cluster │ redshift-cluster-1                                           │
└───────────────────┴──────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Redshift::Cluster" executed in 4s, 98 MB
```
