// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Integration between apigw and Application Load-Balanced Fargate Service",
      Name: "ApigwFargate",
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
      api: "ApigwFargate",
      stage: "ApigwFargate::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "VPC_LINK",
      Description: "API Integration with AWS Fargate Service",
      IntegrationMethod: "GET",
      IntegrationType: "HTTP_PROXY",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
    }),
    dependencies: ({}) => ({
      api: "ApigwFargate",
      listener: "listener::CdkSt-MyFar-RZX6AW5H3B08::HTTP::80",
      vpcLink: "V2 VPC Link",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "GET /",
    }),
    dependencies: ({}) => ({
      api: "ApigwFargate",
      integration:
        "integration::ApigwFargate::listener::CdkSt-MyFar-RZX6AW5H3B08::HTTP::80",
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
      api: "ApigwFargate",
    }),
  },
  {
    type: "VpcLink",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "V2 VPC Link",
    }),
    dependencies: ({}) => ({
      subnets: [
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      ],
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "CdkStack/MyVpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "CdkStack/MyVpc" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
      internetGateway: "CdkStack/MyVpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    properties: ({}) => ({
      PrivateIpAddressIndex: 8305,
    }),
    dependencies: ({}) => ({
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      eip: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    properties: ({}) => ({
      PrivateIpAddressIndex: 3461,
    }),
    dependencies: ({}) => ({
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      eip: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PrivateSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet1",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/MyVpc/PublicSubnet2",
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      subnet: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "CdkStack/MyVpc",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "CdkStack/MyVpc",
      routeTable: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      Description:
        "Automatically created Security Group for ELB CdkStackMyFargateServiceLBE7D87832",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      Description: "CdkStack/MyFargateService/Service/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
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
          Description: "Allow from anyone on port 80",
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      securityGroupFrom: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      ],
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 80,
      IpProtocol: "tcp",
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      securityGroupFrom: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/MyVpc::CdkStack/MyVpc/PublicSubnet2",
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "CdkStack-MyCluster4C1BA579-fZi4x9tf2fSV",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    properties: ({ getId }) => ({
      deploymentConfiguration: {
        deploymentCircuitBreaker: {
          enable: false,
          rollback: false,
        },
        maximumPercent: 200,
        minimumHealthyPercent: 50,
      },
      desiredCount: 1,
      enableECSManagedTags: false,
      enableExecuteCommand: false,
      healthCheckGracePeriodSeconds: 60,
      launchType: "FARGATE",
      loadBalancers: [
        {
          containerName: "web",
          containerPort: 80,
          targetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "CdkSt-MyFar-JZPHMT1E0V5K",
          })}`,
        },
      ],
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "DISABLED",
        },
      },
      platformFamily: "Linux",
      platformVersion: "LATEST",
      schedulingStrategy: "REPLICA",
      serviceName: "CdkStack-MyFargateServiceF490C034-ChqvqbMg0Rkx",
    }),
    dependencies: ({}) => ({
      cluster: "CdkStack-MyCluster4C1BA579-fZi4x9tf2fSV",
      taskDefinition: "CdkStackMyFargateServiceTaskDef846A07DE",
      subnets: [
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceSecurityGroup7016792A-VTFXV0IBDK1Z",
      ],
      targetGroups: ["CdkSt-MyFar-JZPHMT1E0V5K"],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          cpu: 0,
          essential: true,
          image: `${config.accountId()}.dkr.ecr.${
            config.region
          }.amazonaws.com/cdk-hnb659fds-container-assets-${config.accountId()}-${
            config.region
          }:c92a96870c09f92be4993ff173af782a6532353f176ae3a033f1b0a1c6bab043`,
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "MyFargateService",
            },
          },
          name: "web",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
        },
      ],
      cpu: "512",
      family: "CdkStackMyFargateServiceTaskDef846A07DE",
      memory: "2048",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: ({}) => ({
      taskRole:
        "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-1ESH968PSU9BX",
      executionRole:
        "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-1DPVFNV7DEJTX",
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "CdkSt-MyFar-RZX6AW5H3B08",
      targetGroup: "CdkSt-MyFar-JZPHMT1E0V5K",
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSt-MyFar-RZX6AW5H3B08",
      Scheme: "internal",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet1",
        "CdkStack/MyVpc::CdkStack/MyVpc/PrivateSubnet2",
      ],
      securityGroups: [
        "sg::CdkStack/MyVpc::CdkStack-MyFargateServiceLBSecurityGroup6FBF16F1-ADIRE45C9XJE",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "CdkSt-MyFar-JZPHMT1E0V5K",
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "CdkStack/MyVpc",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "CdkStack-MyFargateServiceTaskDefExecutionRoleD6305-1DPVFNV7DEJTX",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
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
                  "ecr:BatchCheckLayerAvailability",
                  "ecr:GetDownloadUrlForLayer",
                  "ecr:BatchGetImage",
                ],
                Resource: `arn:aws:ecr:${
                  config.region
                }:${config.accountId()}:repository/cdk-hnb659fds-container-assets-${config.accountId()}-${
                  config.region
                }`,
                Effect: "Allow",
              },
              {
                Action: "ecr:GetAuthorizationToken",
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:CdkStack-MyFargateServiceTaskDefwebLogGroup4A6C44E8-0cga6xIMrwPR:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "MyFargateServiceTaskDefExecutionRoleDefaultPolicyEC22B20F",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CdkStack-MyFargateServiceTaskDefTaskRole62C7D397-1ESH968PSU9BX",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  },
];
