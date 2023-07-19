---
id: DBCluster
title: DB Cluster
---

Manages a [DB Cluster](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html).

## Example

```js
exports.createResources = () => [
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({ config }) => ({
      DatabaseName: "dev",
      DBClusterIdentifier: "cluster-postgres-stateless",
      Engine: "aurora-postgresql",
      EngineVersion: "10.14",
      EngineMode: "serverless",
      Port: 5432,
      PreferredBackupWindow: "01:39-02:09",
      PreferredMaintenanceWindow: "sun:00:47-sun:01:17",
      ScalingConfiguration: {
        MinCapacity: 2,
        MaxCapacity: 4,
        AutoPause: true,
        SecondsUntilAutoPause: 300,
        TimeoutAction: "RollbackCapacityChange",
        SecondsBeforeTimeout: 300,
      },
      MasterUsername: process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USERNAME,
      MasterUserPassword:
        process.env.CLUSTER_POSTGRES_STATELESS_MASTER_USER_PASSWORD,
      AvailabilityZones: [`${config.region}a`, `${config.region}b`],
    }),
    dependencies: () => ({
      dbSubnetGroup: "subnet-group-postgres-stateless",
      securityGroups: ["security-group-postgres"],
    }),
  },
];
```

## Code Examples

- [aurora-v2](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/aurora-v2)
- [stateless postgres](https://github.com/grucloud/grucloud/blob/main/examples/aws/RDS/postgres-stateless)
- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)
- [auroraserverless-secretsmanager](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/auroraserverless-secretsmanager)
- [fargate-aurora-serverless-cdk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)
- [lambda-aurora-serverless](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/lambda-aurora-serverless)

## Properties

- [CreateDBClusterCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbclustercommandinput.html)

## Dependencies

- [ApplicationAutoScaling Target](../ApplicationAutoScaling/Target.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [RDS DB Subnet Group](./DBSubnetGroup.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)

## List

```sh
gc l -t DBCluster
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 RDS::DBCluster from aws                                                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sam-app-mysql-cluster                                                             │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   AllocatedStorage: 1                                                                   │
│   AvailabilityZones:                                                                    │
│     - "us-east-1c"                                                                      │
│     - "us-east-1b"                                                                      │
│     - "us-east-1a"                                                                      │
│   BackupRetentionPeriod: 1                                                              │
│   DatabaseName: mylab                                                                   │
│   DBClusterIdentifier: sam-app-mysql-cluster                                            │
│   DBClusterParameterGroup: default.aurora-mysql5.7                                      │
│   DBSubnetGroup: sam-app-db-subnet-group                                                │
│   Status: available                                                                     │
│   EarliestRestorableTime: 2022-07-31T10:44:54.832Z                                      │
│   Endpoint: sam-app-mysql-cluster.cluster-c8mtxauy5ngp.us-east-1.rds.amazonaws.com      │
│   ReaderEndpoint: sam-app-mysql-cluster.cluster-ro-c8mtxauy5ngp.us-east-1.rds.amazonaw… │
│   MultiAZ: false                                                                        │
│   Engine: aurora-mysql                                                                  │
│   EngineVersion: 5.7.mysql_aurora.2.09.1                                                │
│   LatestRestorableTime: 2022-07-31T10:44:54.832Z                                        │
│   Port: 3306                                                                            │
│   MasterUsername: masteruser                                                            │
│   PreferredBackupWindow: 04:46-05:16                                                    │
│   PreferredMaintenanceWindow: sat:03:48-sat:04:18                                       │
│   ReadReplicaIdentifiers: []                                                            │
│   DBClusterMembers:                                                                     │
│     - DBInstanceIdentifier: sam-app-mysql-node-1                                        │
│       IsClusterWriter: true                                                             │
│       DBClusterParameterGroupStatus: in-sync                                            │
│       PromotionTier: 1                                                                  │
│   VpcSecurityGroups:                                                                    │
│     - VpcSecurityGroupId: sg-0aff4515ca0c4cb9f                                          │
│       Status: active                                                                    │
│   HostedZoneId: Z2R2ITUGPM61AM                                                          │
│   StorageEncrypted: true                                                                │
│   KmsKeyId: arn:aws:kms:us-east-1:840541460064:key/4e874476-fc25-4ae2-8be9-5b8b96ecc637 │
│   DbClusterResourceId: cluster-LVLUGN7S7NXWVOIR2QFX63GBCE                               │
│   DBClusterArn: arn:aws:rds:us-east-1:840541460064:cluster:sam-app-mysql-cluster        │
│   AssociatedRoles: []                                                                   │
│   IAMDatabaseAuthenticationEnabled: false                                               │
│   ClusterCreateTime: 2022-07-31T10:43:26.794Z                                           │
│   BacktrackWindow: 86400                                                                │
│   EngineMode: provisioned                                                               │
│   DeletionProtection: false                                                             │
│   HttpEndpointEnabled: false                                                            │
│   ActivityStreamStatus: stopped                                                         │
│   CopyTagsToSnapshot: false                                                             │
│   CrossAccountClone: false                                                              │
│   DomainMemberships: []                                                                 │
│   AutoMinorVersionUpgrade: false                                                        │
│   Tags:                                                                                 │
│     - Key: gc-created-by-provider                                                       │
│       Value: aws                                                                        │
│     - Key: gc-managed-by                                                                │
│       Value: grucloud                                                                   │
│     - Key: gc-project-name                                                              │
│       Value: apigw-http-api-lambda-rds-proxy                                            │
│     - Key: gc-stage                                                                     │
│       Value: dev                                                                        │
│     - Key: Name                                                                         │
│       Value: sam-app-mysql-cluster                                                      │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├────────────────┬───────────────────────────────────────────────────────────────────────┤
│ RDS::DBCluster │ sam-app-mysql-cluster                                                 │
└────────────────┴───────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t DBCluster" executed in 5s, 113 MB
```
