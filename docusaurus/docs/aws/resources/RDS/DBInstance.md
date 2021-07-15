---
id: DBInstance
title: DB Instance
---

Manages a [DB Instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html).

## Example

Deploy a postgres database:

```js
const dbCluster = provider.rds.makeDBInstance({
  name: "instance-1",
  dependencies: { dbSubnetGroup, securityGroups },
  properties: () => ({
    DBInstanceClass: "db.t2.micro",
    Engine: "postgres",
    EngineVersion: "12.5",
    MasterUsername: "postgres",
    MasterUserPassword: "peggywenttothemarket",
    AllocatedStorage: 20,
    MaxAllocatedStorage: 1000,
  }),
});
```

## Code Examples

- [postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/rds/postgres/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property)

## Dependencies

- [DB Subnet Group](./DBSubnetGroup)
- [Security Group](../EC2/SecurityGroup)

## List

```sh
gc l -t DBInstance
```

```txt
ting resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 9/9
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 DBInstance from aws                                                                                                         │
├─────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name        │ Data                                                                                                     │ Our  │
├─────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────┤
│ db-instance │ DBInstanceIdentifier: db-instance                                                                        │ Yes  │
│             │ DBInstanceClass: db.t2.micro                                                                             │      │
│             │ Engine: postgres                                                                                         │      │
│             │ DBInstanceStatus: available                                                                              │      │
│             │ MasterUsername: postgres                                                                                 │      │
│             │ Endpoint:                                                                                                │      │
│             │   Address: db-instance.cwzy9iilw73e.eu-west-2.rds.amazonaws.com                                          │      │
│             │   Port: 5432                                                                                             │      │
│             │   HostedZoneId: Z1TTGA775OQIYO                                                                           │      │
│             │ AllocatedStorage: 20                                                                                     │      │
│             │ InstanceCreateTime: 2021-06-14T06:12:04.210Z                                                             │      │
│             │ PreferredBackupWindow: 02:46-03:16                                                                       │      │
│             │ BackupRetentionPeriod: 1                                                                                 │      │
│             │ DBSecurityGroups: []                                                                                     │      │
│             │ VpcSecurityGroups:                                                                                       │      │
│             │   - VpcSecurityGroupId: sg-0f050285a7db813cf                                                             │      │
│             │     Status: active                                                                                       │      │
│             │ DBParameterGroups:                                                                                       │      │
│             │   - DBParameterGroupName: default.postgres12                                                             │      │
│             │     ParameterApplyStatus: in-sync                                                                        │      │
│             │ AvailabilityZone: eu-west-2a                                                                             │      │
│             │ DBSubnetGroup:                                                                                           │      │
│             │   DBSubnetGroupName: subnet-group-postgres                                                               │      │
│             │   DBSubnetGroupDescription: db subnet group                                                              │      │
│             │   VpcId: vpc-06ed1fd5c4769fc49                                                                           │      │
│             │   SubnetGroupStatus: Complete                                                                            │      │
│             │   Subnets:                                                                                               │      │
│             │     - SubnetIdentifier: subnet-07316a55a3d58a61d                                                         │      │
│             │       SubnetAvailabilityZone:                                                                            │      │
│             │         Name: eu-west-2b                                                                                 │      │
│             │       SubnetOutpost:                                                                                     │      │
│             │       SubnetStatus: Active                                                                               │      │
│             │     - SubnetIdentifier: subnet-0b9849bea4dcdc499                                                         │      │
│             │       SubnetAvailabilityZone:                                                                            │      │
│             │         Name: eu-west-2a                                                                                 │      │
│             │       SubnetOutpost:                                                                                     │      │
│             │       SubnetStatus: Active                                                                               │      │
│             │ PreferredMaintenanceWindow: sun:22:36-sun:23:06                                                          │      │
│             │ PendingModifiedValues:                                                                                   │      │
│             │ LatestRestorableTime: 2021-06-14T06:16:35.000Z                                                           │      │
│             │ MultiAZ: false                                                                                           │      │
│             │ EngineVersion: 12.5                                                                                      │      │
│             │ AutoMinorVersionUpgrade: true                                                                            │      │
│             │ ReadReplicaDBInstanceIdentifiers: []                                                                     │      │
│             │ ReadReplicaDBClusterIdentifiers: []                                                                      │      │
│             │ LicenseModel: postgresql-license                                                                         │      │
│             │ OptionGroupMemberships:                                                                                  │      │
│             │   - OptionGroupName: default:postgres-12                                                                 │      │
│             │     Status: in-sync                                                                                      │      │
│             │ PubliclyAccessible: false                                                                                │      │
│             │ StatusInfos: []                                                                                          │      │
│             │ StorageType: gp2                                                                                         │      │
│             │ DbInstancePort: 0                                                                                        │      │
│             │ StorageEncrypted: false                                                                                  │      │
│             │ DbiResourceId: db-35JYGA52SOCTOZT32DQ74WLR7U                                                             │      │
│             │ CACertificateIdentifier: rds-ca-2019                                                                     │      │
│             │ DomainMemberships: []                                                                                    │      │
│             │ CopyTagsToSnapshot: false                                                                                │      │
│             │ MonitoringInterval: 0                                                                                    │      │
│             │ DBInstanceArn: arn:aws:rds:eu-west-2:840541460064:db:db-instance                                         │      │
│             │ IAMDatabaseAuthenticationEnabled: false                                                                  │      │
│             │ PerformanceInsightsEnabled: false                                                                        │      │
│             │ EnabledCloudwatchLogsExports: []                                                                         │      │
│             │ ProcessorFeatures: []                                                                                    │      │
│             │ DeletionProtection: false                                                                                │      │
│             │ AssociatedRoles: []                                                                                      │      │
│             │ MaxAllocatedStorage: 1000                                                                                │      │
│             │ TagList:                                                                                                 │      │
│             │   - Key: ManagedBy                                                                                       │      │
│             │     Value: GruCloud                                                                                      │      │
│             │   - Key: stage                                                                                           │      │
│             │     Value: dev                                                                                           │      │
│             │   - Key: projectName                                                                                     │      │
│             │     Value: rds-postgres                                                                                  │      │
│             │   - Key: CreatedByProvider                                                                               │      │
│             │     Value: aws                                                                                           │      │
│             │   - Key: Name                                                                                            │      │
│             │     Value: db-instance                                                                                   │      │
│             │ DBInstanceAutomatedBackupsReplications: []                                                               │      │
│             │ CustomerOwnedIpEnabled: false                                                                            │      │
│             │                                                                                                          │      │
└─────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                                          │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DBInstance         │ db-instance                                                                                             │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 5 types, 1 provider
Command "gc l -t DBInstance" executed in 4s

```
