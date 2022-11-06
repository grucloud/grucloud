---
id: CacheCluster
title: Cache Cluster
---

Manages an [ElastiCache Cluster](https://console.aws.amazon.com/elasticache/home#/).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateCacheClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcacheclustercommandinput.html)

## Dependencies

- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [ElastiCache Parameter Group](./CacheParameterGroup.md)
- [ElastiCache Subnet Group](./CacheSubnetGroup.md)
- [Firehose Delivery Stream](../Firehose/DeliveryStream.md)
- [SNS Topic](../SNS/Topic.md)

## Full Examples

- [elasticache memcached](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-memcached)

## List

```sh
gc l -t ElastiCache::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 ElastiCache::CacheCluster from aws                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-cluster-001                                                                    │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   CacheClusterId: my-cluster-001                                                        │
│   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do… │
│   CacheNodeType: cache.t2.micro                                                         │
│   Engine: redis                                                                         │
│   EngineVersion: 6.2.6                                                                  │
│   CacheClusterStatus: available                                                         │
│   NumCacheNodes: 1                                                                      │
│   PreferredAvailabilityZone: us-east-1b                                                 │
│   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      │
│   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       │
│   PendingModifiedValues:                                                                │
│   CacheParameterGroup:                                                                  │
│     CacheParameterGroupName: my-parameter-group                                         │
│     ParameterApplyStatus: in-sync                                                       │
│     CacheNodeIdsToReboot: []                                                            │
│   CacheSubnetGroupName: my-subnet-group                                                 │
│   AutoMinorVersionUpgrade: true                                                         │
│   SecurityGroups:                                                                       │
│     - SecurityGroupId: sg-0cc06c2c929f673a0                                             │
│       Status: active                                                                    │
│   ReplicationGroupId: my-cluster                                                        │
│   SnapshotRetentionLimit: 0                                                             │
│   SnapshotWindow: 10:00-11:00                                                           │
│   AuthTokenEnabled: false                                                               │
│   TransitEncryptionEnabled: false                                                       │
│   AtRestEncryptionEnabled: false                                                        │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-001                │
│   ReplicationGroupLogDeliveryEnabled: true                                              │
│   Tags:                                                                                 │
│     - Key: gc-created-by-provider                                                       │
│       Value: aws                                                                        │
│     - Key: gc-managed-by                                                                │
│       Value: grucloud                                                                   │
│     - Key: gc-project-name                                                              │
│       Value: elasticache-redis                                                          │
│     - Key: gc-stage                                                                     │
│       Value: dev                                                                        │
│     - Key: mykey                                                                        │
│       Value: myvalue                                                                    │
│     - Key: Name                                                                         │
│       Value: my-cluster-001                                                             │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-cluster-002                                                                    │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   CacheClusterId: my-cluster-002                                                        │
│   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do… │
│   CacheNodeType: cache.t2.micro                                                         │
│   Engine: redis                                                                         │
│   EngineVersion: 6.2.6                                                                  │
│   CacheClusterStatus: available                                                         │
│   NumCacheNodes: 1                                                                      │
│   PreferredAvailabilityZone: us-east-1a                                                 │
│   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      │
│   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       │
│   PendingModifiedValues:                                                                │
│   CacheParameterGroup:                                                                  │
│     CacheParameterGroupName: my-parameter-group                                         │
│     ParameterApplyStatus: in-sync                                                       │
│     CacheNodeIdsToReboot: []                                                            │
│   CacheSubnetGroupName: my-subnet-group                                                 │
│   AutoMinorVersionUpgrade: true                                                         │
│   SecurityGroups:                                                                       │
│     - SecurityGroupId: sg-0cc06c2c929f673a0                                             │
│       Status: active                                                                    │
│   ReplicationGroupId: my-cluster                                                        │
│   SnapshotRetentionLimit: 1                                                             │
│   SnapshotWindow: 10:00-11:00                                                           │
│   AuthTokenEnabled: false                                                               │
│   TransitEncryptionEnabled: false                                                       │
│   AtRestEncryptionEnabled: false                                                        │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-002                │
│   ReplicationGroupLogDeliveryEnabled: true                                              │
│   Tags:                                                                                 │
│     - Key: gc-created-by-provider                                                       │
│       Value: aws                                                                        │
│     - Key: gc-managed-by                                                                │
│       Value: grucloud                                                                   │
│     - Key: gc-project-name                                                              │
│       Value: elasticache-redis                                                          │
│     - Key: gc-stage                                                                     │
│       Value: dev                                                                        │
│     - Key: mykey                                                                        │
│       Value: myvalue                                                                    │
│     - Key: Name                                                                         │
│       Value: my-cluster-002                                                             │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-cluster-003                                                                    │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   CacheClusterId: my-cluster-003                                                        │
│   ClientDownloadLandingPage: https://console.aws.amazon.com/elasticache/home#client-do… │
│   CacheNodeType: cache.t2.micro                                                         │
│   Engine: redis                                                                         │
│   EngineVersion: 6.2.6                                                                  │
│   CacheClusterStatus: deleting                                                          │
│   NumCacheNodes: 1                                                                      │
│   PreferredAvailabilityZone: us-east-1a                                                 │
│   CacheClusterCreateTime: 2022-10-27T21:28:11.858Z                                      │
│   PreferredMaintenanceWindow: mon:06:00-mon:07:00                                       │
│   PendingModifiedValues:                                                                │
│   CacheParameterGroup:                                                                  │
│     CacheParameterGroupName: my-parameter-group                                         │
│     ParameterApplyStatus: in-sync                                                       │
│     CacheNodeIdsToReboot: []                                                            │
│   CacheSubnetGroupName: my-subnet-group                                                 │
│   AutoMinorVersionUpgrade: true                                                         │
│   SecurityGroups:                                                                       │
│     - SecurityGroupId: sg-0cc06c2c929f673a0                                             │
│       Status: active                                                                    │
│   ReplicationGroupId: my-cluster                                                        │
│   SnapshotRetentionLimit: 0                                                             │
│   SnapshotWindow: 10:00-11:00                                                           │
│   AuthTokenEnabled: false                                                               │
│   TransitEncryptionEnabled: false                                                       │
│   AtRestEncryptionEnabled: false                                                        │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:cluster:my-cluster-003                │
│   ReplicationGroupLogDeliveryEnabled: true                                              │
│   Tags: []                                                                              │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├───────────────────────────┬────────────────────────────────────────────────────────────┤
│ ElastiCache::CacheCluster │ my-cluster-001                                             │
│                           │ my-cluster-002                                             │
│                           │ my-cluster-003                                             │
└───────────────────────────┴────────────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t ElastiCache::CacheCluster" executed in 3s, 107 MB
```
