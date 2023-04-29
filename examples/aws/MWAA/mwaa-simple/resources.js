// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "ElasticIpAddress", group: "EC2", name: "NatGateway1EIP" },
  { type: "ElasticIpAddress", group: "EC2", name: "NatGateway2EIP" },
  { type: "InternetGateway", group: "EC2", name: "MWAAEnvironment" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
      internetGateway: "MWAAEnvironment",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NatGateway1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 23,
    }),
    dependencies: ({}) => ({
      subnet: "MWAAEnvironment::MWAAEnvironment Public Subnet (AZ1)",
      eip: "NatGateway1EIP",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NatGateway2",
    properties: ({}) => ({
      PrivateIpAddressIndex: 158,
    }),
    dependencies: ({}) => ({
      subnet: "MWAAEnvironment::MWAAEnvironment Public Subnet (AZ2)",
      eip: "NatGateway2EIP",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "NatGateway1",
      routeTable: "MWAAEnvironment::MWAAEnvironment Private Routes (AZ1)",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "NatGateway2",
      routeTable: "MWAAEnvironment::MWAAEnvironment Private Routes (AZ2)",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "MWAAEnvironment",
      routeTable: "MWAAEnvironment::MWAAEnvironment Public Routes",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MWAAEnvironment Private Routes (AZ1)",
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MWAAEnvironment Private Routes (AZ2)",
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MWAAEnvironment Public Routes",
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MWAAEnvironment::MWAAEnvironment Private Routes (AZ1)",
      subnet: "MWAAEnvironment::MWAAEnvironment Private Subnet (AZ1)",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MWAAEnvironment::MWAAEnvironment Private Routes (AZ2)",
      subnet: "MWAAEnvironment::MWAAEnvironment Private Subnet (AZ2)",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MWAAEnvironment::MWAAEnvironment Public Routes",
      subnet: "MWAAEnvironment::MWAAEnvironment Public Subnet (AZ1)",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MWAAEnvironment::MWAAEnvironment Public Routes",
      subnet: "MWAAEnvironment::MWAAEnvironment Public Subnet (AZ2)",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "airflow-security-group-MyAirflowEnvironment-tdqCRx",
      Description:
        "Security Group for Amazon MWAA Environment MyAirflowEnvironment",
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "airflow-security-group-MyAirflowEnvironment-v6BSDR",
      Description:
        "Security Group for Amazon MWAA Environment MyAirflowEnvironment",
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "no-ingress-sg",
      Description: "Security group with no ingress rule",
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::MWAAEnvironment::airflow-security-group-MyAirflowEnvironment-tdqCRx",
      securityGroupFrom: [
        "sg::MWAAEnvironment::airflow-security-group-MyAirflowEnvironment-tdqCRx",
      ],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::MWAAEnvironment::airflow-security-group-MyAirflowEnvironment-v6BSDR",
      securityGroupFrom: [
        "sg::MWAAEnvironment::airflow-security-group-MyAirflowEnvironment-v6BSDR",
      ],
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MWAAEnvironment Private Subnet (AZ1)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 20,
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MWAAEnvironment Private Subnet (AZ2)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 21,
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MWAAEnvironment Public Subnet (AZ1)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 10,
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MWAAEnvironment Public Subnet (AZ2)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 11,
    }),
    dependencies: ({}) => ({
      vpc: "MWAAEnvironment",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "MWAAEnvironment",
    properties: ({}) => ({
      CidrBlock: "10.192.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "MWAA-Execution-Policy-ee2af493-8f0a-46f4-a71e-610b2ff9ec6c",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "airflow:PublishMetrics",
            Resource: `arn:aws:airflow:${
              config.region
            }:${config.accountId()}:environment/MyAirflowEnvironment`,
          },
          {
            Effect: "Deny",
            Action: "s3:ListAllMyBuckets",
            Resource: [
              "arn:aws:s3:::gc-mwaa-test",
              "arn:aws:s3:::gc-mwaa-test/*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
            Resource: [
              "arn:aws:s3:::gc-mwaa-test",
              "arn:aws:s3:::gc-mwaa-test/*",
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
              "logs:PutLogEvents",
              "logs:GetLogEvents",
              "logs:GetLogRecord",
              "logs:GetLogGroupFields",
              "logs:GetQueryResults",
            ],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:airflow-MyAirflowEnvironment-*`,
            ],
          },
          {
            Effect: "Allow",
            Action: ["logs:DescribeLogGroups"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: "cloudwatch:PutMetricData",
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "sqs:ChangeMessageVisibility",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
              "sqs:GetQueueUrl",
              "sqs:ReceiveMessage",
              "sqs:SendMessage",
            ],
            Resource: `arn:aws:sqs:${config.region}:*:airflow-celery-*`,
          },
          {
            Effect: "Allow",
            Action: [
              "kms:Decrypt",
              "kms:DescribeKey",
              "kms:GenerateDataKey*",
              "kms:Encrypt",
            ],
            NotResource: `arn:aws:kms:*:${config.accountId()}:key/*`,
            Condition: {
              StringLike: {
                "kms:ViaService": [`sqs.${config.region}.amazonaws.com`],
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: "MWAA-Execution-Policy-f814ac39-34db-48c4-9cbb-cc4bf056cdd0",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "airflow:PublishMetrics",
            Resource: `arn:aws:airflow:${
              config.region
            }:${config.accountId()}:environment/MyAirflowEnvironment`,
          },
          {
            Effect: "Deny",
            Action: "s3:ListAllMyBuckets",
            Resource: [
              "arn:aws:s3:::gc-mwaa-test",
              "arn:aws:s3:::gc-mwaa-test/*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
            Resource: [
              "arn:aws:s3:::gc-mwaa-test",
              "arn:aws:s3:::gc-mwaa-test/*",
            ],
          },
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogStream",
              "logs:CreateLogGroup",
              "logs:PutLogEvents",
              "logs:GetLogEvents",
              "logs:GetLogRecord",
              "logs:GetLogGroupFields",
              "logs:GetQueryResults",
            ],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:airflow-MyAirflowEnvironment-*`,
            ],
          },
          {
            Effect: "Allow",
            Action: ["logs:DescribeLogGroups"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: "cloudwatch:PutMetricData",
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "sqs:ChangeMessageVisibility",
              "sqs:DeleteMessage",
              "sqs:GetQueueAttributes",
              "sqs:GetQueueUrl",
              "sqs:ReceiveMessage",
              "sqs:SendMessage",
            ],
            Resource: `arn:aws:sqs:${config.region}:*:airflow-celery-*`,
          },
          {
            Effect: "Allow",
            Action: [
              "kms:Decrypt",
              "kms:DescribeKey",
              "kms:GenerateDataKey*",
              "kms:Encrypt",
            ],
            NotResource: `arn:aws:kms:*:${config.accountId()}:key/*`,
            Condition: {
              StringLike: {
                "kms:ViaService": [`sqs.${config.region}.amazonaws.com`],
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AmazonMWAA-MyAirflowEnvironment-5mqrsR",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: ["airflow-env.amazonaws.com", "airflow.amazonaws.com"],
            },
          },
        ],
        Version: "2012-10-17",
      },
    }),
    dependencies: ({}) => ({
      policies: ["MWAA-Execution-Policy-ee2af493-8f0a-46f4-a71e-610b2ff9ec6c"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "AmazonMWAA-MyAirflowEnvironment-RAZcH1",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: ["airflow-env.amazonaws.com", "airflow.amazonaws.com"],
            },
          },
        ],
        Version: "2012-10-17",
      },
    }),
    dependencies: ({}) => ({
      policies: ["MWAA-Execution-Policy-f814ac39-34db-48c4-9cbb-cc4bf056cdd0"],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-mwaa-test",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: true,
          },
        ],
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "gc-mwaa-test-1",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: true,
          },
        ],
      },
    }),
  },
];
