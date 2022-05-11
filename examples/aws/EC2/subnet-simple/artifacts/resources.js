// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpb-subnet",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-a",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "192.168.0.0/16",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "vpb-subnet",
    }),
  },
];
