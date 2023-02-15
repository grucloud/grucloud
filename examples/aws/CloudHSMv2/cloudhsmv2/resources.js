// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Cluster",
    group: "CloudHSMV2",
    properties: ({}) => ({
      BackupRetentionPolicy: {
        Type: "DAYS",
        Value: "7",
      },
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      vpc: "vpc",
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "Hsm",
    group: "CloudHSMV2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: ({}) => ({
      cluster: "cluster::vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private2-${config.region}b`,
      subnet: `vpc::subnet-private2-${config.region}b`,
    }),
  },
];