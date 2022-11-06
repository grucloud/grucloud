exports.createResources = () => [
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({}) => ({
      DatabaseName: "dev",
      DBClusterIdentifier: "cluster-postgres-stateless",
      Engine: "aurora-postgresql",
      EngineVersion: "10.18",
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
      Tags: [
        {
          Key: "mykey1",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      dbSubnetGroup: "subnet-group-postgres-stateless",
      securityGroups: ["sg::vpc::security-group-postgres"],
    }),
  },
];
