// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "flowlog",
    properties: ({}) => ({
      retentionInDays: 1,
    }),
  },
  {
    type: "FlowLogs",
    group: "EC2",
    name: "flowlog-interface",
    properties: ({}) => ({
      TrafficType: "ALL",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({}) => ({
      networkInterface: "eni::machine",
      iamRole: "flow-role",
      cloudWatchLogGroup: "flowlog",
    }),
  },
  {
    type: "NetworkInterface",
    group: "EC2",
    name: "eni::machine",
    readOnly: true,
    properties: ({}) => ({
      Description: "",
    }),
    dependencies: ({}) => ({
      instance: "machine",
    }),
  },
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
    name: ({ config }) => `project-subnet-public1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "10.0.0.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "project-rtb-public",
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "project-rtb-public",
      subnet: `project-subnet-public1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "project-rtb-public",
      ig: "project-igw",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::project-vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "project-vpc",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "machine",
    properties: ({ config, getId }) => ({
      InstanceType: "t2.micro",
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::project-vpc::default",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: `project-subnet-public1-${config.region}a`,
          })}`,
        },
      ],
      Image: {
        Description:
          "Amazon Linux 2 Kernel 5.10 AMI 2.0.20220426.0 x86_64 HVM gp2",
      },
    }),
    dependencies: ({ config }) => ({
      subnets: [`project-subnet-public1-${config.region}a`],
      securityGroups: ["sg::project-vpc::default"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "flow-role",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `vpc-flow-logs.amazonaws.com`,
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
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "logs:DescribeLogGroups",
                  "logs:DescribeLogStreams",
                ],
                Effect: "Allow",
                Resource: `*`,
              },
            ],
          },
          PolicyName: "cloudwatchlogs",
        },
      ],
    }),
  },
];
