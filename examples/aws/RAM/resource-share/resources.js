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
      DnsHostnames: true,
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
    name: "project-vpc::project-rtb-public",
    dependencies: ({}) => ({
      vpc: "project-vpc",
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
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "project-igw",
      routeTable: "project-vpc::project-rtb-public",
    }),
  },
  {
    type: "Organisation",
    group: "Organisations",
    name: "frederic.heem@gmail.com",
    readOnly: true,
    properties: ({}) => ({
      AvailablePolicyTypes: [
        {
          Status: "ENABLED",
          Type: "SERVICE_CONTROL_POLICY",
        },
      ],
      FeatureSet: "ALL",
      MasterAccountEmail: "frederic.heem@gmail.com",
    }),
  },
  {
    type: "ResourceShare",
    group: "RAM",
    properties: ({}) => ({
      allowExternalPrincipals: false,
      featureSet: "STANDARD",
      name: "my-share",
    }),
  },
  {
    type: "PrincipalAssociation",
    group: "RAM",
    properties: ({ config }) => ({
      associatedEntity: config.accountDev,
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "my-share",
    }),
  },
  {
    type: "PrincipalAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "my-share",
      organisation: "frederic.heem@gmail.com",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({ config }) => ({
      resourceShare: "my-share",
      subnet: `project-vpc::project-subnet-public1-${config.region}a`,
    }),
  },
];
