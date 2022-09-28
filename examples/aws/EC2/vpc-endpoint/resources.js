// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "project-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "project-igw" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "project-vpc",
      internetGateway: "project-igw",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `project-vpc::project-subnet-public1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `project-vpc::project-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "project-vpc::project-rtb-public",
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private1-${config.region}a`,
      subnet: `project-vpc::project-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "project-vpc::project-rtb-public",
      subnet: `project-vpc::project-subnet-public1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `project-vpc::project-rtb-private1-${config.region}a`,
      vpcEndpoint: "project-vpc::project-vpce-s3",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "project-igw",
      routeTable: "project-vpc::project-rtb-public",
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "project-vpce-s3",
    properties: ({ config }) => ({
      PolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "*",
            Resource: "*",
          },
        ],
      },
      PrivateDnsEnabled: false,
      RequesterManaged: false,
      VpcEndpointType: "Gateway",
      ServiceName: `com.amazonaws.${config.region}.s3`,
    }),
    dependencies: ({ config }) => ({
      vpc: "project-vpc",
      routeTables: [`project-vpc::project-rtb-private1-${config.region}a`],
    }),
  },
];
