module.exports = ({ stage, region }) => ({
  rds: {
    instance: {
      name: "db-instance",
      properties: {
        DBInstanceClass: "db.t3.micro",
        Engine: "postgres",
        EngineVersion: "12.5",
        MasterUsername: process.env.MASTER_USERNAME,
        MasterUserPassword: process.env.MASTER_USER_PASSWORD,
        AllocatedStorage: 20,
        MaxAllocatedStorage: 1000,
        PubliclyAccessible: true,
        PreferredBackupWindow: "22:10-22:40",
      },
    },
  },
});
