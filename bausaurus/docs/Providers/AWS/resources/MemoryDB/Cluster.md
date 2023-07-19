---
id: Cluster
title: Cluster
---

Manages a [MemoryDB Cluster](https://console.aws.amazon.com/memorydb/home?#/clusters).

## Example

```js
exports.createResources = () => [
  {
    type: "Cluster",
    group: "MemoryDB",
    properties: ({}) => ({
      EngineVersion: "6.2",
      MaintenanceWindow: "sun:07:00-sun:08:00",
      Name: "my-cluster",
      NodeType: "db.t4g.small",
      NumberOfShards: 1,
      SnapshotWindow: "09:00-10:00",
    }),
    dependencies: ({}) => ({
      acl: "my-acl",
      parameterGroup: "param-group",
      securityGroups: ["sg::vpc::default"],
      subnetGroup: "subnet-group",
    }),
  },
];
```

## Code Examples

- [memorydb simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple)

## Properties

- [CreateClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createclustercommandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [KMS Key](../KMS/Key.md)
- [MemoryDB ACL](./ACL.md)
- [MemoryDB Parameter Group](./ParameterGroup.md)
- [MemoryDB Subnet Group](./SubnetGroup.md)

## List

```sh
gc l -t MemoryDB::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 MemoryDB::Cluster from aws                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: my-cluster                                                             │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   ACLName: my-acl                                                            │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:cluster/my-cluster            │
│   AutoMinorVersionUpgrade: true                                              │
│   ClusterEndpoint:                                                           │
│     Port: 6379                                                               │
│   EnginePatchVersion: 6.2.6                                                  │
│   EngineVersion: 6.2                                                         │
│   MaintenanceWindow: sun:07:00-sun:08:00                                     │
│   Name: my-cluster                                                           │
│   NodeType: db.t4g.small                                                     │
│   NumberOfShards: 1                                                          │
│   ParameterGroupName: param-group                                            │
│   ParameterGroupStatus: in-sync                                              │
│   SecurityGroups:                                                            │
│     - SecurityGroupId: sg-0866160c0d1c4767a                                  │
│       Status: active                                                         │
│   SnapshotRetentionLimit: 1                                                  │
│   SnapshotWindow: 09:00-10:00                                                │
│   Status: creating                                                           │
│   SubnetGroupName: subnet-group                                              │
│   TLSEnabled: true                                                           │
│   Tags:                                                                      │
│     - Key: gc-created-by-provider                                            │
│       Value: aws                                                             │
│     - Key: gc-managed-by                                                     │
│       Value: grucloud                                                        │
│     - Key: gc-project-name                                                   │
│       Value: memorydb-simple                                                 │
│     - Key: gc-stage                                                          │
│       Value: dev                                                             │
│     - Key: Name                                                              │
│       Value: my-cluster                                                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ MemoryDB::Cluster │ my-cluster                                              │
└───────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t MemoryDB::Cluster" executed in 3s, 100 MB
```
