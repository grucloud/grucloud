// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "InternetGateway", group: "EC2", name: "ig-postgres" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc-postgres",
      internetGateway: "ig-postgres",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "ig-postgres",
      routeTable: "vpc-postgres::route-table-public",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table-public",
    dependencies: ({}) => ({
      vpc: "vpc-postgres",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-postgres::route-table-public",
      subnet: "vpc-postgres::subnet-1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-postgres::route-table-public",
      subnet: "vpc-postgres::subnet-2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "security-group",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-postgres",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 5432,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
      ToPort: 5432,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-postgres::security-group",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 3,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-postgres",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 3,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-postgres",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-postgres",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "lambda-policy",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
          {
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  },
  {
    type: "DBInstance",
    group: "RDS",
    properties: ({}) => ({
      DBInstanceIdentifier: "db-instance",
      DBInstanceClass: "db.t3.micro",
      Engine: "postgres",
      MasterUsername: process.env.DB_INSTANCE_MASTER_USERNAME,
      AllocatedStorage: 20,
      PreferredBackupWindow: "22:10-22:40",
      BackupRetentionPeriod: 1,
      PreferredMaintenanceWindow: "fri:23:40-sat:00:10",
      EngineVersion: "14.2",
      PubliclyAccessible: true,
      DeletionProtection: false,
      MaxAllocatedStorage: 50,
      Tags: [
        {
          Key: "mykey2",
          Value: "myvalue",
        },
      ],
      MasterUserPassword: process.env.DB_INSTANCE_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup: "subnet-group-postgres",
      securityGroups: ["sg::vpc-postgres::security-group"],
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    properties: ({}) => ({
      DBSubnetGroupName: "subnet-group-postgres",
      DBSubnetGroupDescription: "db subnet group",
      Tags: [
        {
          Key: "mykey2",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-postgres::subnet-1", "vpc-postgres::subnet-2"],
    }),
  },
];
