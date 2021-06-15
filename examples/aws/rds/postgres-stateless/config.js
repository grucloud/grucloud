const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  rds: {
    vpc: {
      name: "vpc-postgres-stateless",
    },
    subnet1: {
      name: "subnetA",
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
      name: "subnet-group-postgres-stateless",
      properties: {},
    },
    cluster: {
      name: "cluster-postgres-stateless",
      properties: {
        DatabaseName: "dev",
        Engine: "aurora-postgresql",
        EngineVersion: "10.14",
        EngineMode: "serverless",
        ScalingConfiguration: {
          MinCapacity: 2,
          MaxCapacity: 4,
        },
        MasterUsername: process.env.MASTER_USERNAME,
        MasterUserPassword: process.env.MASTER_USER_PASSWORD,
      },
    },
  },
  keyPair: { name: "kp" },
  eip: { name: "eip" },
  ec2Instance: {
    name: "bastion",
    properties: () => ({
      InstanceType: "t2.micro",
    }),
  },
});
