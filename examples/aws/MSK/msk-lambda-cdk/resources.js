// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "MskLambdaCdkStack/Vpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
      internetGateway: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 3167,
    }),
    dependencies: ({}) => ({
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet1",
      eip: "MskLambdaCdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet2",
    properties: ({}) => ({
      PrivateIpAddressIndex: 7879,
    }),
    dependencies: ({}) => ({
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet2",
      eip: "MskLambdaCdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PrivateSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PrivateSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PrivateSubnet1",
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PrivateSubnet2",
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet1",
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet2",
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet1",
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet2",
      subnet: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "MskLambdaCdkStack/Vpc/PublicSubnet1",
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "MskLambdaCdkStack/Vpc/PublicSubnet2",
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "MskLambdaCdkStack/Vpc",
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "MskLambdaCdkStack/Vpc",
      routeTable: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "MskLambdaCdkStack-ClusterSecurityGroup0921994B-1H3NMNNAMJQES",
      Description: "MSK security group",
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "MskLambdaCdkStack-TransactionHandlerSecurityGroupD51168B7-TOHEHUAH1BK6",
      Description:
        "Automatic security group for Lambda Function MskLambdaCdkStackTransactionHandler34472FB3",
    }),
    dependencies: ({}) => ({
      vpc: "MskLambdaCdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "allow all from anywhere",
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::MskLambdaCdkStack/Vpc::MskLambdaCdkStack-ClusterSecurityGroup0921994B-1H3NMNNAMJQES",
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "MskLambdaCdkStack/Vpc/PublicSubnet2",
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "MskLambdaCdkStack-TransactionHandlerServiceRoleC80-1ARY91Y27AJ39",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
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
                  "kafka:DescribeCluster",
                  "kafka:GetBootstrapBrokers",
                  "kafka:ListScramSecrets",
                ],
                Resource: `arn:aws:kafka:${
                  config.region
                }:${config.accountId()}:cluster/myclusterviasimplecdk/c0d84e52-a90b-4ab8-966c-c8abbe70e494-20`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "TransactionHandlerServiceRoleDefaultPolicyA1B22C24",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
        {
          PolicyName: "AWSLambdaMSKExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaMSKExecutionRole",
        },
        {
          PolicyName: "AWSLambdaVPCAccessExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
        },
      ],
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    properties: ({}) => ({
      AmazonManagedKafkaEventSourceConfig: {
        ConsumerGroupId: "e5a660b1-88f8-4399-b357-62a971cfb782",
      },
      BatchSize: 100,
      StartingPosition: "LATEST",
      Topics: ["transactions"],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "TransactionHandler",
      mskCluster: "myclusterviasimplecdk",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          },
        },
        FunctionName: "TransactionHandler",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
        Timeout: 60,
      },
    }),
    dependencies: ({}) => ({
      role: "MskLambdaCdkStack-TransactionHandlerServiceRoleC80-1ARY91Y27AJ39",
      subnets: [
        "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
        "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::MskLambdaCdkStack/Vpc::MskLambdaCdkStack-TransactionHandlerSecurityGroupD51168B7-TOHEHUAH1BK6",
      ],
    }),
  },
  {
    type: "ClusterV2",
    group: "MSK",
    properties: ({ getId }) => ({
      ClusterName: "myclusterviasimplecdk",
      Provisioned: {
        BrokerNodeGroupInfo: {
          BrokerAZDistribution: "DEFAULT",
          ClientSubnets: [
            `${getId({
              type: "Subnet",
              group: "EC2",
              name: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
            })}`,
            `${getId({
              type: "Subnet",
              group: "EC2",
              name: "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
            })}`,
          ],
          ConnectivityInfo: {
            PublicAccess: {
              Type: "DISABLED",
            },
          },
          InstanceType: "kafka.m5.large",
          SecurityGroups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::MskLambdaCdkStack/Vpc::MskLambdaCdkStack-ClusterSecurityGroup0921994B-1H3NMNNAMJQES",
            })}`,
          ],
          StorageInfo: {
            EbsStorageInfo: {
              VolumeSize: 50,
            },
          },
        },
        EncryptionInfo: {
          EncryptionInTransit: {
            ClientBroker: "TLS",
            InCluster: true,
          },
        },
        EnhancedMonitoring: "DEFAULT",
        LoggingInfo: {
          BrokerLogs: {
            CloudWatchLogs: {
              Enabled: false,
            },
            Firehose: {
              Enabled: false,
            },
            S3: {
              Enabled: false,
            },
          },
        },
        NumberOfBrokerNodes: 2,
        OpenMonitoring: {
          Prometheus: {
            JmxExporter: {
              EnabledInBroker: false,
            },
            NodeExporter: {
              EnabledInBroker: false,
            },
          },
        },
        StorageMode: "LOCAL",
        KafkaVersion: "2.8.1",
      },
    }),
    dependencies: ({}) => ({
      subnets: [
        "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet1",
        "MskLambdaCdkStack/Vpc::MskLambdaCdkStack/Vpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::MskLambdaCdkStack/Vpc::MskLambdaCdkStack-ClusterSecurityGroup0921994B-1H3NMNNAMJQES",
      ],
    }),
  },
];
