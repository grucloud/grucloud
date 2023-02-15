// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-ipv6",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      AmazonProvidedIpv6CidrBlock: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-a",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Ipv6Native: true,
      Ipv6SubnetPrefix: "01",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-ipv6",
    }),
  },
];