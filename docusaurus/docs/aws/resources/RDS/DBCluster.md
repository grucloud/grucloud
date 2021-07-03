---
id: DBCluster
title: DB Cluster
---

Manages a [DB Cluster](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html).

## Example

```js
const region = "eu-west-2";

const dbCluster = provider.rds.makeDBCluster({
  name: "cluster",
  dependencies: { dbSubnetGroup },
  properties: () => ({
    DatabaseName: "dev",
    Engine: "aurora-postgresql",
    EngineVersion: "10.14",
    EngineMode: "serverless",
    ScalingConfiguration: {
      MinCapacity: 2,
      MaxCapacity: 4,
    },
    MasterUsername: "postgres",
    MasterUserPassword: "peggywenttothemarket",
    AvailabilityZones: [`${region}a`, `${region}b`],
  }),
});
```

## Code Examples

- [stateless postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/rds/postgres-stateless/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property)

## Dependencies

- [DB Subnet Group](./DBSubnetGroup)

## List

```sh
gc l -t DBCluster
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 8/8
┌──────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 DBClu… │                                                                                                  │
├──────────┼───────────────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                                                      │ Our  │
├──────────┼───────────────────────────────────────────────────────────────────────────────────────────┼──────┤
│ cluster  │ AllocatedStorage: 1                                                                       │ Yes  │
│          │ AvailabilityZones:                                                                        │      │
│          │   - "eu-west-2c"                                                                          │      │
│          │   - "eu-west-2a"                                                                          │      │
│          │   - "eu-west-2b"                                                                          │      │
│          │ BackupRetentionPeriod: 1                                                                  │      │
│          │ DatabaseName: dev                                                                         │      │
│          │ DBClusterIdentifier: cluster                                                              │      │
│          │ DBClusterParameterGroup: default.aurora-postgresql10                                      │      │
│          │ DBSubnetGroup: db-subnet-group                                                            │      │
│          │ Status: available                                                                         │      │
│          │ EarliestRestorableTime: 2021-06-10T09:08:16.767Z                                          │      │
│          │ Endpoint: cluster.cluster-cwzy9iilw73e.eu-west-2.rds.amazonaws.com                        │      │
│          │ CustomEndpoints: []                                                                       │      │
│          │ MultiAZ: false                                                                            │      │
│          │ Engine: aurora-postgresql                                                                 │      │
│          │ EngineVersion: 10.14                                                                      │      │
│          │ LatestRestorableTime: 2021-06-10T09:14:04.485Z                                            │      │
│          │ Port: 5432                                                                                │      │
│          │ MasterUsername: postgres                                                                  │      │
│          │ DBClusterOptionGroupMemberships: []                                                       │      │
│          │ PreferredBackupWindow: 04:57-05:27                                                        │      │
│          │ PreferredMaintenanceWindow: sat:23:14-sat:23:44                                           │      │
│          │ ReadReplicaIdentifiers: []                                                                │      │
│          │ DBClusterMembers: []                                                                      │      │
│          │ VpcSecurityGroups:                                                                        │      │
│          │   - VpcSecurityGroupId: sg-01e30cdc63fda9c17                                              │      │
│          │     Status: active                                                                        │      │
│          │ HostedZoneId: Z1TTGA775OQIYO                                                              │      │
│          │ StorageEncrypted: true                                                                    │      │
│          │ KmsKeyId: arn:aws:kms:eu-west-2:840541460064:key/53a82424-5abc-48b8-a20f-9d1904aa4d99     │      │
│          │ DbClusterResourceId: cluster-E7N5BIRMABN23D573BYMHILEOE                                   │      │
│          │ DBClusterArn: arn:aws:rds:eu-west-2:840541460064:cluster:cluster                          │      │
│          │ AssociatedRoles: []                                                                       │      │
│          │ IAMDatabaseAuthenticationEnabled: false                                                   │      │
│          │ ClusterCreateTime: 2021-06-10T09:07:12.114Z                                               │      │
│          │ EnabledCloudwatchLogsExports: []                                                          │      │
│          │ Capacity: 0                                                                               │      │
│          │ EngineMode: serverless                                                                    │      │
│          │ ScalingConfigurationInfo:                                                                 │      │
│          │   MinCapacity: 2                                                                          │      │
│          │   MaxCapacity: 4                                                                          │      │
│          │   AutoPause: true                                                                         │      │
│          │   SecondsUntilAutoPause: 300                                                              │      │
│          │   TimeoutAction: RollbackCapacityChange                                                   │      │
│          │ DeletionProtection: false                                                                 │      │
│          │ HttpEndpointEnabled: false                                                                │      │
│          │ ActivityStreamStatus: stopped                                                             │      │
│          │ CopyTagsToSnapshot: false                                                                 │      │
│          │ CrossAccountClone: false                                                                  │      │
│          │ DomainMemberships: []                                                                     │      │
│          │ TagList:                                                                                  │      │
│          │   - Key: ManagedBy                                                                        │      │
│          │     Value: GruCloud                                                                       │      │
│          │   - Key: stage                                                                            │      │
│          │     Value: dev                                                                            │      │
│          │   - Key: projectName                                                                      │      │
│          │     Value: rds-example                                                                    │      │
│          │   - Key: CreatedByProvider                                                                │      │
│          │     Value: aws                                                                            │      │
│          │   - Key: Name                                                                             │      │
│          │     Value: cluster                                                                        │      │
│          │                                                                                           │      │
└──────────┴───────────────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                        │
├────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ DBCluster          │ cluster                                                                               │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 5 types, 1 provider
Command "gc l -t DBCluster" executed in 3s
```
