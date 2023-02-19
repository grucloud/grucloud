// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: ({}) => ({
      cloudwatchRole:
        "PrivateAPIGatewayApi-PrivateAPIGatewayCloudWatchRo-11BENGHNP8O44",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description:
        "A VPC Lambda to get request from API Gateway Private API with CDK",
      endpointConfiguration: {
        types: ["PRIVATE"],
      },
      name: "PrivateAPIGateway",
      tags: {
        Key: "Value",
        Project: "PrivateAPIGateway",
      },
      schema: {
        openapi: "3.0.1",
        info: {
          description:
            "A VPC Lambda to get request from API Gateway Private API with CDK",
          title: "PrivateAPIGateway",
          version: "1",
        },
        paths: {
          "/": {
            "x-amazon-apigateway-any-method": {
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k/invocations`,
              },
            },
          },
          "/{proxy+}": {
            "x-amazon-apigateway-any-method": {
              parameters: [
                {
                  name: "proxy",
                  in: "path",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "prod",
      },
    }),
    dependencies: ({ config }) => ({
      vpcEndpoints: [
        `priv-apigw-vpc::com.amazonaws.${config.region}.execute-api`,
      ],
    }),
  },
  {
    type: "RestApiPolicy",
    group: "APIGateway",
    properties: ({ getId }) => ({
      policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: "*",
            },
            Action: "execute-api:Invoke",
            Resource: `${getId({
              type: "RestApi",
              group: "APIGateway",
              name: "PrivateAPIGateway",
              path: "live.arnv2",
            })}/*/*/*`,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      restApi: "PrivateAPIGateway",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "prod",
      tags: {
        Key: "Value",
        Project: "PrivateAPIGateway",
      },
    }),
    dependencies: ({}) => ({
      restApi: "PrivateAPIGateway",
      account: "default",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "priv-apigw-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "priv-apigw-vpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
      internetGateway: "priv-apigw-vpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}a`,
    properties: ({}) => ({
      PrivateIpAddressIndex: 210,
    }),
    dependencies: ({ config }) => ({
      subnet: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}a`,
      eip: `priv-apigw-vpc-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-private-subnet-1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-private-subnet-1-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 8,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-private-subnet-1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-private-subnet-1-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
      subnet: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}b`,
      subnet: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}a`,
      subnet: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}b`,
      subnet: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      natGateway: `priv-apigw-vpc-public-subnet-1-${config.region}a`,
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      natGateway: `priv-apigw-vpc-public-subnet-1-${config.region}a`,
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      ig: "priv-apigw-vpc",
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}a`,
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ config }) => ({
      ig: "priv-apigw-vpc",
      routeTable: `priv-apigw-vpc::priv-apigw-vpc-public-subnet-1-${config.region}b`,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::priv-apigw-vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "PrivateAPIGatewayApi-apiGatewayEndpointSG77497598-GGMHPQKFRIVE",
      Description: "Security Group for Api Gateway Endpoint",
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "PrivateAPIGateway",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "PrivateAPIGatewayApi-handlerSecurityGroup39AF83FC-1FWNCMH5HTL2B",
      Description:
        "Automatic security group for Lambda Function PrivateAPIGatewayApihandlerDC3C4FDE",
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "PrivateAPIGateway",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "priv-apigw-vpc",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "10.0.0.0/8",
          Description: "from 10.0.0.0/8:443",
        },
        {
          CidrIp: "10.0.0.0/16",
          Description: "from 10.0.0.0/16:443",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::priv-apigw-vpc::PrivateAPIGatewayApi-apiGatewayEndpointSG77497598-GGMHPQKFRIVE",
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: ({ config }) => `priv-apigw-vpc-public-subnet-1-${config.region}a`,
  },
  {
    type: "Instance",
    group: "EC2",
    name: "apiGatewayEC2Instance",
    properties: ({ config, getId }) => ({
      InstanceType: "t3.micro",
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
              name: "sg::priv-apigw-vpc::default",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
          })}`,
        },
      ],
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "PrivateAPIGateway",
        },
      ],
      Image: {
        Description: "Amazon Linux AMI 2018.03.0.20230207.0 x86_64 HVM gp2",
      },
      UserData: `#!/bin/bash
sudo yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm
restart amazon-ssm-agent`,
      CreditSpecification: {
        CpuCredits: "unlimited",
      },
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
      ],
      iamInstanceProfile:
        "PrivateAPIGatewayEc2-PrivateAPIGatewayEc2Profile-qZJnuwy2ztCR",
      securityGroups: ["sg::priv-apigw-vpc::default"],
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    properties: ({ config }) => ({
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.execute-api`,
      PrivateDnsEnabled: true,
    }),
    dependencies: ({ config }) => ({
      vpc: "priv-apigw-vpc",
      subnets: [
        `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
        `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}b`,
      ],
      securityGroups: [
        "sg::priv-apigw-vpc::PrivateAPIGatewayApi-apiGatewayEndpointSG77497598-GGMHPQKFRIVE",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "PrivateAPIGatewayApi-handlerServiceRole187D5A5A-1BJGJGQK7M9ID",
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
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "PrivateAPIGateway",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "PrivateAPIGatewayApi-PrivateAPIGatewayCloudWatchRo-11BENGHNP8O44",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "PrivateAPIGateway",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "PrivateAPIGatewayEc2-apigatewayEC2Role0C7CF12E-805DC7BJETWT",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonSSMManagedInstanceCore",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
      ],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "PrivateAPIGatewayEc2-PrivateAPIGatewayEc2Profile-qZJnuwy2ztCR",
    dependencies: ({}) => ({
      roles: ["PrivateAPIGatewayEc2-apigatewayEC2Role0C7CF12E-805DC7BJETWT"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
        Handler: "index.ProxyLambda",
        Runtime: "nodejs14.x",
      },
      Tags: {
        Project: "PrivateAPIGateway",
        Key: "Value",
      },
    }),
    dependencies: ({ config }) => ({
      role: "PrivateAPIGatewayApi-handlerServiceRole187D5A5A-1BJGJGQK7M9ID",
      subnets: [
        `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}a`,
        `priv-apigw-vpc::priv-apigw-vpc-private-subnet-1-${config.region}b`,
      ],
      securityGroups: [
        "sg::priv-apigw-vpc::PrivateAPIGatewayApi-handlerSecurityGroup39AF83FC-1FWNCMH5HTL2B",
      ],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "PrivateAPIGatewayApi-handlerInvokeFcyXBRX02EWa52GlFECQiCzDt0fdRUDi4mo4foC5aU532DE476-NNSQCY01VVHH",
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "PrivateAPIGatewayApi-PrivateAPIGatewayANYApiPermissionPrivateAPIGatewayApiPrivateAPIGa-H1JILPGSOR9I",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "PrivateAPIGateway",
            path: "live.arnv2",
          })}/prod/*/`,
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "PrivateAPIGatewayApi-PrivateAPIGatewayANYApiPermissionTestPrivateAPIGatewayApiPrivateA-HYYGL9NUWAWK",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "PrivateAPIGateway",
            path: "live.arnv2",
          })}/test-invoke-stage/*/`,
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "PrivateAPIGatewayApi-PrivateAPIGatewayproxyANYApiPermissionPrivateAPIGatewayApiPrivate-VWTLVKVBVWI2",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "PrivateAPIGateway",
            path: "live.arnv2",
          })}/prod/*/*`,
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "PrivateAPIGatewayApi-PrivateAPIGatewayproxyANYApiPermissionTestPrivateAPIGatewayApiPri-KTPNG1I1T4T4",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "PrivateAPIGateway",
            path: "live.arnv2",
          })}/test-invoke-stage/*/*`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "PrivateAPIGatewayApi-handlerE1533BD5-K2tcMYal940k",
      apiGatewayRestApis: ["PrivateAPIGateway"],
    }),
  },
];