// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpc::subnet-a",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/16",
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
];
