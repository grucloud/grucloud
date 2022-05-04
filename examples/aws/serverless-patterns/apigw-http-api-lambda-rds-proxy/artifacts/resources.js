// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/rds/cluster/sam-app-mysql-cluster/error",
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/rds/proxy/rds-proxy",
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "RDSOSMetrics",
    properties: ({}) => ({
      retentionInDays: 30,
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "sam-app-vpc",
    properties: ({}) => ({
      CidrBlock: "172.31.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "sam-app-prv-sub-1",
    properties: ({ config }) => ({
      CidrBlock: "172.31.0.0/24",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: ({}) => ({
      vpc: "sam-app-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "sam-app-prv-sub-2",
    properties: ({ config }) => ({
      CidrBlock: "172.31.1.0/24",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: ({}) => ({
      vpc: "sam-app-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "sam-app-prv-sub-3",
    properties: ({ config }) => ({
      CidrBlock: "172.31.2.0/24",
      AvailabilityZone: `${config.region}c`,
    }),
    dependencies: ({}) => ({
      vpc: "sam-app-vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "lambda-sg",
      Description: "Security Groups for the AWS Lambda for accessing RDS/Proxy",
    }),
    dependencies: ({}) => ({
      vpc: "sam-app-vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "sam-app-database-sg",
      Description: "security group (firewall)",
    }),
    dependencies: ({}) => ({
      vpc: "sam-app-vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 0,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        ToPort: 65535,
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::sam-app-vpc::lambda-sg",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "-1",
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::sam-app-vpc::sam-app-database-sg",
      securityGroupFrom: ["sg::sam-app-vpc::sam-app-database-sg"],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 3306,
        IpProtocol: "tcp",
        ToPort: 3306,
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::sam-app-vpc::sam-app-database-sg",
      securityGroupFrom: ["sg::sam-app-vpc::lambda-sg"],
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 0,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        ToPort: 65535,
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::sam-app-vpc::lambda-sg",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-dbProxyRole-1BMIN3H39UUK3",
    properties: ({ config }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `rds.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["secretsmanager:GetSecretValue"],
                Resource: [
                  `arn:aws:secretsmanager:${
                    config.region
                  }:${config.accountId()}:secret:secretClusterMasterUser-Mug7ijgYl9HN-4MRKXh`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "DBProxyPolicy",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: ({ config }) => `sam-app-monitor-${config.region}`,
    properties: ({}) => ({
      Description:
        "Allows your Aurora DB cluster to deliver Enhanced Monitoring metrics.",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `monitoring.rds.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonRDSEnhancedMonitoringRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole",
        },
      ],
    }),
  },
  {
    type: "DBProxy",
    group: "RDS",
    name: "rds-proxy",
    properties: ({ getId }) => ({
      EngineFamily: "MYSQL",
      Auth: [
        {
          AuthScheme: "SECRETS",
          SecretArn: `${getId({
            type: "Secret",
            group: "SecretsManager",
            name: "sam-app-cluster-secret",
          })}`,
          IAMAuth: "REQUIRED",
        },
      ],
      RequireTLS: true,
      IdleClientTimeout: 120,
      DebugLogging: false,
    }),
    dependencies: ({}) => ({
      subnets: ["sam-app-prv-sub-1", "sam-app-prv-sub-2", "sam-app-prv-sub-3"],
      securityGroups: ["sg::sam-app-vpc::sam-app-database-sg"],
      secret: ["sam-app-cluster-secret"],
      role: "sam-app-dbProxyRole-1BMIN3H39UUK3",
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    name: "sam-app-db-subnet-group",
    properties: ({}) => ({
      DBSubnetGroupDescription: "subnets allowed for deploying DB instances",
    }),
    dependencies: ({}) => ({
      subnets: ["sam-app-prv-sub-1", "sam-app-prv-sub-2", "sam-app-prv-sub-3"],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    name: "sam-app-mysql-cluster",
    properties: ({}) => ({
      BackupRetentionPeriod: 1,
      DatabaseName: "mylab",
      Engine: "aurora-mysql",
      EngineVersion: "5.7.mysql_aurora.2.09.1",
      Port: 3306,
      MasterUsername: process.env.SAM_APP_MYSQL_CLUSTER_MASTER_USERNAME,
      PreferredBackupWindow: "04:46-05:16",
      PreferredMaintenanceWindow: "sat:03:48-sat:04:18",
      IAMDatabaseAuthenticationEnabled: false,
      BacktrackWindow: 86400,
      EngineMode: "provisioned",
      DeletionProtection: false,
      HttpEndpointEnabled: false,
      MasterUserPassword:
        process.env.SAM_APP_MYSQL_CLUSTER_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup: "sam-app-db-subnet-group",
      securityGroups: ["sg::sam-app-vpc::sam-app-database-sg"],
      secret: "sam-app-cluster-secret",
    }),
  },
  {
    type: "DBInstance",
    group: "RDS",
    name: "sam-app-mysql-node-1",
    properties: ({}) => ({
      DBInstanceIdentifier: "sam-app-mysql-node-1",
      DBInstanceClass: "db.r5.large",
      Engine: "aurora-mysql",
      PreferredMaintenanceWindow: "thu:06:23-thu:06:53",
      EngineVersion: "5.7.mysql_aurora.2.09.1",
      PubliclyAccessible: false,
      StorageType: "aurora",
      DBClusterIdentifier: "sam-app-mysql-cluster",
      StorageEncrypted: true,
      CopyTagsToSnapshot: true,
      MonitoringInterval: 1,
      PerformanceInsightsEnabled: true,
      PerformanceInsightsRetentionPeriod: 7,
      EnablePerformanceInsights: true,
      MasterUsername: process.env.SAM_APP_MYSQL_NODE_1_MASTER_USERNAME,
      MasterUserPassword: process.env.SAM_APP_MYSQL_NODE_1_MASTER_USER_PASSWORD,
    }),
    dependencies: ({ config }) => ({
      dbSubnetGroup: "sam-app-db-subnet-group",
      securityGroups: ["sg::sam-app-vpc::sam-app-database-sg"],
      secret: "sam-app-cluster-secret",
      dbCluster: "sam-app-mysql-cluster",
      monitoringRole: `sam-app-monitor-${config.region}`,
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    name: "sam-app-cluster-secret",
    properties: ({ generatePassword }) => ({
      SecretString: {
        password: generatePassword({ length: 10 }),
        username: "masteruser",
        port: 3306,
      },
      Description:
        "Master user credentials for DB cluster 'sam-app-mysql-cluster'",
    }),
  },
];
