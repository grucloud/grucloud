// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-4-record-vpc-endpoint",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-public",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-4-record-vpc-endpoint",
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "endpoint-ec2",
    properties: ({ config }) => ({
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.ec2`,
      PrivateDnsEnabled: true,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-4-record-vpc-endpoint",
      subnets: ["vpc-4-record-vpc-endpoint::subnet-public"],
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "vpce.grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
      vpc: "vpc-4-record-vpc-endpoint",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      Name: "ec2.vpce.grucloud.org.",
      Type: "A",
      AliasTarget: {
        EvaluateTargetHealth: true,
      },
    }),
    dependencies: ({}) => ({
      hostedZone: "vpce.grucloud.org.",
      vpcEndpoint: "vpc-4-record-vpc-endpoint::endpoint-ec2",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];