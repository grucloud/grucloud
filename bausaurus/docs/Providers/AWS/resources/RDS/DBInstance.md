---
id: DBInstance
title: DB Instance
---

Manages a [DB Instance](https://console.aws.amazon.com/rds/home?#databases:).

## Example

Deploy a postgres database:

```js
exports.createResources = () => [
  {
    type: "DBInstance",
    group: "RDS",
    properties: ({ config }) => ({
      DBInstanceIdentifier: "db-instance",
      DBInstanceClass: "db.t3.micro",
      Engine: "postgres",
      EngineVersion: "12.5",
      AllocatedStorage: 20,
      MaxAllocatedStorage: 1000,
      PubliclyAccessible: true,
      PreferredBackupWindow: "22:10-22:40",
      PreferredMaintenanceWindow: "fri:23:40-sat:00:10",
      BackupRetentionPeriod: 1,
      MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,
      MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
    }),
    dependencies: () => ({
      dbSubnetGroup: "subnet-group-postgres",
      securityGroups: ["security-group"],
    }),
  },
];
```

## Code Examples

- [postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres)
- [aurora-v2](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/aurora-v2)
- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)

## Properties

- [CreateDBInstanceCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbinstancecommandinput.html)

## Dependencies

- [RDS DB Subnet Group](./DBSubnetGroup.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [IAM Role](../IAM/Role.md)
- [KMS Key](../KMS/Key.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

## List

```sh
gc l -t DBInstance
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────┐
│ 1 RDS::DBInstance from aws                                             │
├────────────────────────────────────────────────────────────────────────┤
│ name: db-instance                                                      │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   DBInstanceIdentifier: db-instance                                    │
│   DBInstanceClass: db.t2.micro                                         │
│   Engine: postgres                                                     │
│   DBInstanceStatus: available                                          │
│   MasterUsername: postgres                                             │
│   Endpoint:                                                            │
│     Address: db-instance.c8mtxauy5ngp.us-east-1.rds.amazonaws.com      │
│     Port: 5432                                                         │
│     HostedZoneId: Z2R2ITUGPM61AM                                       │
│   AllocatedStorage: 20                                                 │
│   InstanceCreateTime: 2022-03-09T20:47:12.440Z                         │
│   PreferredBackupWindow: 22:10-22:40                                   │
│   BackupRetentionPeriod: 1                                             │
│   DBSecurityGroups: []                                                 │
│   VpcSecurityGroups:                                                   │
│     - VpcSecurityGroupId: sg-048ed7ed0716e19f2                         │
│       Status: active                                                   │
│   DBParameterGroups:                                                   │
│     - DBParameterGroupName: default.postgres12                         │
│       ParameterApplyStatus: in-sync                                    │
│   AvailabilityZone: us-east-1a                                         │
│   DBSubnetGroup:                                                       │
│     DBSubnetGroupName: subnet-group-postgres                           │
│     DBSubnetGroupDescription: db subnet group                          │
│     VpcId: vpc-0d5b0c96f249946d7                                       │
│     SubnetGroupStatus: Complete                                        │
│     Subnets:                                                           │
│       - SubnetIdentifier: subnet-0ffb0ef569d4a8716                     │
│         SubnetAvailabilityZone:                                        │
│           Name: us-east-1a                                             │
│         SubnetOutpost:                                                 │
│         SubnetStatus: Active                                           │
│       - SubnetIdentifier: subnet-0fa8cee733fa0d508                     │
│         SubnetAvailabilityZone:                                        │
│           Name: us-east-1b                                             │
│         SubnetOutpost:                                                 │
│         SubnetStatus: Active                                           │
│   PreferredMaintenanceWindow: fri:23:40-sat:00:10                      │
│   PendingModifiedValues:                                               │
│   LatestRestorableTime: 2022-03-09T22:04:32.000Z                       │
│   MultiAZ: false                                                       │
│   EngineVersion: 12.6                                                  │
│   AutoMinorVersionUpgrade: true                                        │
│   ReadReplicaDBInstanceIdentifiers: []                                 │
│   LicenseModel: postgresql-license                                     │
│   OptionGroupMemberships:                                              │
│     - OptionGroupName: default:postgres-12                             │
│       Status: in-sync                                                  │
│   PubliclyAccessible: true                                             │
│   StorageType: gp2                                                     │
│   DbInstancePort: 0                                                    │
│   StorageEncrypted: false                                              │
│   DbiResourceId: db-CHPXAN6BYZBXLQJSNTKWT3IZ4Y                         │
│   CACertificateIdentifier: rds-ca-2019                                 │
│   DomainMemberships: []                                                │
│   CopyTagsToSnapshot: false                                            │
│   MonitoringInterval: 0                                                │
│   DBInstanceArn: arn:aws:rds:us-east-1:840541460064:db:db-instance     │
│   IAMDatabaseAuthenticationEnabled: false                              │
│   PerformanceInsightsEnabled: false                                    │
│   DeletionProtection: false                                            │
│   AssociatedRoles: []                                                  │
│   MaxAllocatedStorage: 1000                                            │
│   CustomerOwnedIpEnabled: false                                        │
│   ActivityStreamStatus: stopped                                        │
│   BackupTarget: region                                                 │
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
│       Value: db-instance                                               │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├─────────────────┬─────────────────────────────────────────────────────┤
│ RDS::DBInstance │ db-instance                                         │
└─────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t DBInstance" executed in 4s, 216 MB
```
