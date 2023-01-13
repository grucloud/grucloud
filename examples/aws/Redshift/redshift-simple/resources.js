// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
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
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Account",
    group: "Organisations",
    name: "test account",
    readOnly: true,
    properties: ({}) => ({
      Email: "test@grucloud.com",
      Name: "test account",
    }),
  },
  {
    type: "Cluster",
    group: "Redshift",
    properties: ({}) => ({
      ClusterIdentifier: "redshift-cluster-1",
      NodeType: "ra3.xlplus",
      MasterUsername: "awsuser",
      DBName: "dev",
      ClusterParameterGroups: [
        {
          ParameterGroupName: "group-1",
        },
      ],
      ClusterSubnetGroupName: "cluster-subnet-group-1",
      NumberOfNodes: 2,
      EnhancedVpcRouting: true,
      AvailabilityZoneRelocationStatus: "enabled",
      MasterUserPassword: process.env.REDSHIFT_CLUSTER_1_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      clusterSubnetGroup: "cluster-subnet-group-1",
      clusterParameterGroups: ["group-1"],
      vpcSecurityGroups: ["sg::vpc::default"],
    }),
  },
  {
    type: "ClusterParameterGroup",
    group: "Redshift",
    properties: ({}) => ({
      ParameterGroupName: "group-1",
      ParameterGroupFamily: "redshift-1.0",
      Description: "group 1",
    }),
  },
  {
    type: "ClusterSubnetGroup",
    group: "Redshift",
    properties: ({}) => ({
      ClusterSubnetGroupName: "cluster-subnet-group-1",
      Description: "cluster-subnet-group-1",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "EndpointAuthorization",
    group: "Redshift",
    dependencies: ({}) => ({
      account: "test account",
      cluster: "redshift-cluster-1",
    }),
  },
];
