// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "InternetGateway", group: "EC2", name: "AlbLambdaCdkStack/MyVPC" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
      internetGateway: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "AlbLambdaCdkStack/MyVPC",
      routeTable:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "AlbLambdaCdkStack/MyVPC",
      routeTable:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
      subnet:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
      subnet:
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "AlbLambdaCdkStack-MyLoadBalancerSG5F91329E-1E80CKYEVNK4Z",
      Description: "AlbLambdaCdkStack/MyLoadBalancerSG",
    }),
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
          Description: "from 0.0.0.0/0:80",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack-MyLoadBalancerSG5F91329E-1E80CKYEVNK4Z",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 1,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 1,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "AlbLambdaCdkStack/MyVPC",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "AlbLambdaCdkStack/MyVPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "AlbLam-MyLoa-L5ONUHVSP4YQ",
                })}`,
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "AlbLam-MyLoa-L5ONUHVSP4YQ",
          })}`,
          Type: "forward",
        },
      ],
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "AlbLa-MyLoa-FULXT8UVTYSQ",
      targetGroups: ["AlbLam-MyLoa-L5ONUHVSP4YQ"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "AlbLa-MyLoa-FULXT8UVTYSQ",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet1",
        "AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack/MyVPC/VpcSubnetGroupSubnet2",
      ],
      securityGroups: [
        "sg::AlbLambdaCdkStack/MyVPC::AlbLambdaCdkStack-MyLoadBalancerSG5F91329E-1E80CKYEVNK4Z",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckIntervalSeconds: 35,
      HealthCheckPath: "/",
      HealthCheckTimeoutSeconds: 30,
      Matcher: {
        HttpCode: "200",
      },
      Name: "AlbLam-MyLoa-L5ONUHVSP4YQ",
      TargetType: "lambda",
    }),
  },
  {
    type: "TargetGroupAttachments",
    group: "ElasticLoadBalancingV2",
    properties: ({ config }) => ({
      Targets: [
        {
          Id: `arn:aws:lambda:${
            config.region
          }:${config.accountId()}:function:AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2`,
        },
      ],
    }),
    dependencies: ({}) => ({
      elbTargetGroup: "AlbLam-MyLoa-L5ONUHVSP4YQ",
      lambdaFunctions: [
        "AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "AlbLambdaCdkStack-LambdaFunctionServiceRoleC555A46-1JFOLO9M14YK1",
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
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
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
        FunctionName: "AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2",
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "AlbLambdaCdkStack-LambdaFunctionServiceRoleC555A46-1JFOLO9M14YK1",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2",
          Principal: "elasticloadbalancing.amazonaws.com",
          StatementId:
            "AlbLambdaCdkStack-LambdaFunctionInvoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HYAD69E89D-8UQB6KD5YZ6B",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2",
    }),
  },
];
