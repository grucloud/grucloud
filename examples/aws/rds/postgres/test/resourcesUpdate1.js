const createResources = ({ provider }) => {
  provider.RDS.makeDBInstance({
    name: "db-instance",
    properties: ({ config }) => ({
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
    dependencies: ({ resources }) => ({
      dbSubnetGroup: resources.RDS.DBSubnetGroup.subnetGroupPostgres,
      securityGroups: [resources.EC2.SecurityGroup.securityGroup],
    }),
  });
};

exports.createResources = createResources;
