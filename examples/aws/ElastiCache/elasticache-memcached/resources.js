// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
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
    properties: ({}) => ({
      GroupName: "elasticache",
      Description: "elasticache",
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
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
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "CacheCluster",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheClusterId: "my-memcached",
      CacheNodeType: "cache.t2.micro",
      CacheSubnetGroupName: "my-memcached",
      Engine: "memcached",
      EngineVersion: "1.6.12",
      NumCacheNodes: 1,
      PreferredAvailabilityZone: "us-east-1a",
      PreferredMaintenanceWindow: "sun:03:30-sun:04:30",
    }),
    dependencies: ({}) => ({
      subnetGroup: "my-memcached",
    }),
  },
  {
    type: "CacheParameterGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheParameterGroupFamily: "memcached1.6",
      CacheParameterGroupName: "my-param-group-memcached",
      Description: "My Memcached Param group",
    }),
  },
  {
    type: "CacheSubnetGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheSubnetGroupDescription: "my subnet group",
      CacheSubnetGroupName: "my-memcached",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
];