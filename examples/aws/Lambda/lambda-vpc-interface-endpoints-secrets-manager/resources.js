// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RouteTable",
    group: "EC2",
    name: "AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
      subnet:
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
      subnet:
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "PrivateLambdaSG",
      Description: "AwsLambdaPrivSubnetStack/PrivateLambdaSG",
    }),
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "-1",
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::PrivateLambdaVPC::PrivateLambdaSG",
      securityGroupFrom: ["sg::PrivateLambdaVPC::PrivateLambdaSG"],
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
          CidrIp: "10.0.0.0/16",
          Description: "from 10.0.0.0/16:443",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::PrivateLambdaVPC::PrivateLambdaSG",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 1,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 1,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "PrivateLambdaVPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    properties: ({ config }) => ({
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.secretsmanager`,
      PrivateDnsEnabled: true,
    }),
    dependencies: ({}) => ({
      vpc: "PrivateLambdaVPC",
      subnets: [
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
      ],
      securityGroups: ["sg::PrivateLambdaVPC::PrivateLambdaSG"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "AwsLambdaPrivSubnetStack-LambdaFunctionPrivateServ-1PJW75N0R82N7",
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
                  "ec2:CreateNetworkInterface",
                  "ec2:DeleteNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "secretsmanager:ListSecrets",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaFunctionPrivateServiceRoleDefaultPolicy4FFCABF1",
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
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "LambdaFunctionPrivate",
        Runtime: "python3.9",
        Timeout: 60,
        Handler: "handler.lambda_handler",
      },
    }),
    dependencies: ({}) => ({
      role: "AwsLambdaPrivSubnetStack-LambdaFunctionPrivateServ-1PJW75N0R82N7",
      subnets: [
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet1",
        "PrivateLambdaVPC::AwsLambdaPrivSubnetStack/PrivateLambdaVPC/IsolatedSubnet2",
      ],
      securityGroups: ["sg::PrivateLambdaVPC::PrivateLambdaSG"],
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "CDKExampleSecret23C61B24-xgHFg67ZoX5Y",
      SecretString: {
        SecretString: generatePassword({ length: 32 }),
      },
    }),
  },
];
