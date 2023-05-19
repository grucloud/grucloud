// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "DBCluster",
    group: "DocDB",
    properties: ({}) => ({
      DBClusterIdentifier: "docdb",
      DBClusterParameterGroupName: "my-param-group",
      DBSubnetGroupName: "my-subnet-group",
      DeletionProtection: false,
      EngineVersion: "5.0.0",
      MasterUsername: "docdbuser",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "thu:03:59-thu:04:29",
      StorageEncrypted: true,
      MasterUserPassword: process.env.DOCDB_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbClusterParameterGroup: "my-param-group",
      dbSubnetGroup: "my-subnet-group",
      globalCluster: "global-cluster",
    }),
  },
  {
    type: "DBClusterParameterGroup",
    group: "DocDB",
    properties: ({}) => ({
      DBClusterParameterGroupName: "my-param-group",
      DBParameterGroupFamily: "docdb5.0",
      Description: "My Param Group",
      Parameters: [
        {
          ApplyMethod: "immediate",
          ParameterName: "profiler_threshold_ms",
          ParameterValue: "200",
        },
      ],
    }),
  },
  {
    type: "DBInstance",
    group: "DocDB",
    properties: ({ config }) => ({
      AutoMinorVersionUpgrade: true,
      AvailabilityZone: `${config.region}a`,
      CopyTagsToSnapshot: false,
      DBInstanceClass: "db.r6g.large",
      DBInstanceIdentifier: "docdb",
      EngineVersion: "5.0.0",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "thu:08:16-thu:08:46",
      PromotionTier: 1,
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      dbCluster: "docdb",
    }),
  },
  {
    type: "DBInstance",
    group: "DocDB",
    properties: ({ config }) => ({
      AutoMinorVersionUpgrade: true,
      AvailabilityZone: `${config.region}b`,
      CopyTagsToSnapshot: false,
      DBInstanceClass: "db.r6g.large",
      DBInstanceIdentifier: "docdb2",
      EngineVersion: "5.0.0",
      PreferredBackupWindow: "00:00-00:30",
      PreferredMaintenanceWindow: "sun:06:16-sun:06:46",
      PromotionTier: 1,
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      dbCluster: "docdb",
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "DocDB",
    properties: ({}) => ({
      DBSubnetGroupDescription: "My Subnet Group",
      DBSubnetGroupName: "my-subnet-group",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `global-vpc::global-subnet-private1-${config.region}a`,
        `global-vpc::global-subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "EventSubscription",
    group: "DocDB",
    properties: ({}) => ({
      Enabled: true,
      EventCategories: ["failure", "notification", "configuration change"],
      SourceType: "db-cluster",
      SubscriptionName: "event-subscription",
    }),
    dependencies: ({}) => ({
      snsTopic: "docdb-topic",
    }),
  },
  {
    type: "GlobalCluster",
    group: "DocDB",
    properties: ({}) => ({
      DeletionProtection: false,
      Engine: "docdb",
      EngineVersion: "5.0.0",
      GlobalClusterIdentifier: "global-cluster",
      StorageEncrypted: true,
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `global-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "global-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `global-rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "global-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `global-vpc::global-rtb-private1-${config.region}a`,
      subnet: `global-vpc::global-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `global-vpc::global-rtb-private2-${config.region}b`,
      subnet: `global-vpc::global-subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `global-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "global-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `global-subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "global-vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "global-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "Topic", group: "SNS", name: "docdb-topic" },
];