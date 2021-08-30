const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  rds: {
    vpc: {
      name: "vpc-postgres",
    },
    internetGateway: {
      name: "ig-postgres",
    },
    subnets: [
      {
        name: "subnet-1",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: `${region}a`,
        },
      },
      {
        name: "subnet-2",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: `${region}b`,
        },
      },
    ],
    subnetGroup: {
      name: "subnet-group-postgres",
      properties: {},
    },
    instance: {
      name: "db-instance",
      properties: {
        DBInstanceClass: "db.t2.micro",
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
    databaseName: "dev",
  },
});
