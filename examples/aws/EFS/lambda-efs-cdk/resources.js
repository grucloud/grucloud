// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "EFS LAMBDA APIGATEWAY",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "EFS LAMBDA APIGATEWAY",
      stage: "EFS LAMBDA APIGATEWAY::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: ({}) => ({
      api: "EFS LAMBDA APIGATEWAY",
      lambdaFunction: "LambdaEfsCdkStack-lambdaEfsHandlerBBFE6EBB-4lqoQXa068di",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "$default",
    }),
    dependencies: ({}) => ({
      api: "EFS LAMBDA APIGATEWAY",
      integration:
        "integration::EFS LAMBDA APIGATEWAY::LambdaEfsCdkStack-lambdaEfsHandlerBBFE6EBB-4lqoQXa068di",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
    }),
    dependencies: ({}) => ({
      api: "EFS LAMBDA APIGATEWAY",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "LambdaEfsCdkStack/theVpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
      internetGateway: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 7656,
    }),
    dependencies: ({}) => ({
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet1",
      eip: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
    properties: ({}) => ({
      PrivateIpAddressIndex: 13775,
    }),
    dependencies: ({}) => ({
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet2",
      eip: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PrivateSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PrivateSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PrivateSubnet1",
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PrivateSubnet2",
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet1",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet2",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet1",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet2",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "LambdaEfsCdkStack/theVpc",
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "LambdaEfsCdkStack/theVpc",
      routeTable:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PublicSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "LambdaEfsCdkStack-lambdaEfsHandlerSecurityGroup32CE0F81-EMH4JCPGIQL9",
      Description:
        "Automatic security group for Lambda Function LambdaEfsCdkStacklambdaEfsHandlerB00F09C4",
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "LambdaEfsCdkStack-theFileSystemEfsSecurityGroupF0AB1967-94CWPTNBN535",
      Description: "LambdaEfsCdkStack/theFileSystem/EfsSecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "LambdaEfsCdkStack/theVpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 2049,
      IpProtocol: "tcp",
      ToPort: 2049,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack-theFileSystemEfsSecurityGroupF0AB1967-94CWPTNBN535",
      securityGroupFrom: [
        "sg::LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack-lambdaEfsHandlerSecurityGroup32CE0F81-EMH4JCPGIQL9",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "LambdaEfsCdkStack/theVpc/PublicSubnet2",
  },
  { type: "FileSystem", group: "EFS", name: "LambdaEfsCdkStack/theFileSystem" },
  {
    type: "AccessPoint",
    group: "EFS",
    name: "fsap-0f9b5098e28420897",
    properties: ({}) => ({
      PosixUser: {
        Gid: 1001,
        SecondaryGids: [],
        Uid: 1001,
      },
      RootDirectory: {
        CreationInfo: {
          OwnerGid: 1001,
          OwnerUid: 1001,
          Permissions: "750",
        },
        Path: "/export/lambda",
      },
    }),
    dependencies: ({}) => ({
      fileSystem: "LambdaEfsCdkStack/theFileSystem",
    }),
  },
  {
    type: "MountTarget",
    group: "EFS",
    properties: ({ config }) => ({
      AvailabilityZoneName: `${config.region}a`,
    }),
    dependencies: ({}) => ({
      fileSystem: "LambdaEfsCdkStack/theFileSystem",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet1",
      securityGroups: [
        "sg::LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack-theFileSystemEfsSecurityGroupF0AB1967-94CWPTNBN535",
      ],
    }),
  },
  {
    type: "MountTarget",
    group: "EFS",
    properties: ({ config }) => ({
      AvailabilityZoneName: `${config.region}b`,
    }),
    dependencies: ({}) => ({
      fileSystem: "LambdaEfsCdkStack/theFileSystem",
      subnet:
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet2",
      securityGroups: [
        "sg::LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack-theFileSystemEfsSecurityGroupF0AB1967-94CWPTNBN535",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName:
        "LambdaEfsCdkStack-lambdaEfsHandlerServiceRoleEBA1A-M6GQ3IQFDWIJ",
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
                Condition: {
                  StringEquals: {
                    "elasticfilesystem:AccessPointArn": `${getId({
                      type: "AccessPoint",
                      group: "EFS",
                      name: "fsap-0f9b5098e28420897",
                    })}`,
                  },
                },
                Action: "elasticfilesystem:ClientMount",
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: "elasticfilesystem:ClientWrite",
                Resource: `arn:aws:elasticfilesystem:${
                  config.region
                }:${config.accountId()}:file-system/fs-091f9d849810b485a`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "lambdaEfsHandlerServiceRoleDefaultPolicy8712ACC0",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
        {
          PolicyName: "AWSLambdaVPCAccessExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
        },
      ],
    }),
    dependencies: ({}) => ({
      efsFileSystems: ["fsap-0f9b5098e28420897"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        FileSystemConfigs: [
          {
            Arn: `${getId({
              type: "AccessPoint",
              group: "EFS",
              name: "fsap-0f9b5098e28420897",
            })}`,
            LocalMountPath: "/mnt/text",
          },
        ],
        FunctionName: "LambdaEfsCdkStack-lambdaEfsHandlerBBFE6EBB-4lqoQXa068di",
        Handler: "lambda_function.lambda_handler",
        Runtime: "python3.8",
      },
    }),
    dependencies: ({}) => ({
      role: "LambdaEfsCdkStack-lambdaEfsHandlerServiceRoleEBA1A-M6GQ3IQFDWIJ",
      subnets: [
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet1",
        "LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack/theVpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::LambdaEfsCdkStack/theVpc::LambdaEfsCdkStack-lambdaEfsHandlerSecurityGroup32CE0F81-EMH4JCPGIQL9",
      ],
      efsAccessPoints: ["fsap-0f9b5098e28420897"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "LambdaEfsCdkStack-lambdaEfsHandlerBBFE6EBB-4lqoQXa068di",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "LambdaEfsCdkStack-EFSLAMBDAAPIGATEWAYDefaultRouteLambdaFunctionPermission8726AE76-B6AB3FDTLP5B",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "EFS LAMBDA APIGATEWAY",
            path: "live.ArnV2",
          })}/*/*`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "LambdaEfsCdkStack-lambdaEfsHandlerBBFE6EBB-4lqoQXa068di",
      apiGatewayV2Apis: ["EFS LAMBDA APIGATEWAY"],
    }),
  },
];
