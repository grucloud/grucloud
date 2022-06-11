// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-dual",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      AmazonProvidedIpv6CidrBlock: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "vpc-dual::subnet-dual",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      CidrBlock: "10.0.0.0/24",
      MapPublicIpOnLaunch: true,
      AssignIpv6AddressOnCreation: true,
      Ipv6SubnetPrefix: "00",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-dual",
    }),
  },
];
