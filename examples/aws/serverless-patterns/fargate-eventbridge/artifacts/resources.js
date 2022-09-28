// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "EventBus",
    group: "CloudWatchEvents",
    properties: ({}) => ({
      Name: "DemoEventBus",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName:
        "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-VaqaPjMDaE1N",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc8378EB38",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "VpcIGWD7BA715C" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
      internetGateway: "VpcIGWD7BA715C",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "VpcPublicSubnet1NATGateway4D7517AA",
    dependencies: ({}) => ({
      subnet: "Vpc8378EB38::VpcPublicSubnet1Subnet5C2D37C4",
      eip: "VpcPublicSubnet1EIPD7E02669",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "VpcPublicSubnet2NATGateway9182C01D",
    dependencies: ({}) => ({
      subnet: "Vpc8378EB38::VpcPublicSubnet2Subnet691E08A3",
      eip: "VpcPublicSubnet2EIP3C605A87",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc8378EB38::VpcPrivateSubnet1Subnet536B997A",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 2,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc8378EB38::VpcPrivateSubnet2Subnet3788AAA1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 2,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc8378EB38::VpcPublicSubnet1Subnet5C2D37C4",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc8378EB38::VpcPublicSubnet2Subnet691E08A3",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
      NewBits: 2,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Vpc8378EB38::VpcPrivateSubnet1RouteTableB2C5B500",
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Vpc8378EB38::VpcPrivateSubnet2RouteTableA678073B",
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Vpc8378EB38::VpcPublicSubnet1RouteTable6C95E38E",
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Vpc8378EB38::VpcPublicSubnet2RouteTable94F7E489",
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPrivateSubnet1RouteTableB2C5B500",
      subnet: "Vpc8378EB38::VpcPrivateSubnet1Subnet536B997A",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPrivateSubnet2RouteTableA678073B",
      subnet: "Vpc8378EB38::VpcPrivateSubnet2Subnet3788AAA1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPublicSubnet1RouteTable6C95E38E",
      subnet: "Vpc8378EB38::VpcPublicSubnet1Subnet5C2D37C4",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPublicSubnet2RouteTable94F7E489",
      subnet: "Vpc8378EB38::VpcPublicSubnet2Subnet691E08A3",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPrivateSubnet1RouteTableB2C5B500",
      natGateway: "VpcPublicSubnet1NATGateway4D7517AA",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPrivateSubnet2RouteTableA678073B",
      natGateway: "VpcPublicSubnet2NATGateway9182C01D",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPublicSubnet1RouteTable6C95E38E",
      ig: "VpcIGWD7BA715C",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "Vpc8378EB38::VpcPublicSubnet2RouteTable94F7E489",
      ig: "VpcIGWD7BA715C",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-FargateServiceLBSecurityGroup5F444C78-1QV2YOS62F1B5",
      Description:
        "Automatically created Security Group for ELB CdkStackFargateServiceLB29CE988E",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "CdkStack-FargateServiceSecurityGroup262B61DD-1VXQH2HSL89F2",
      Description: "CdkStack/FargateService/Service/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "CdkStack-VpcEbInterfaceEndpointSecurityGroupE08A80D2-7XKKU5JDDTFV",
      Description: "CdkStack/Vpc/EbInterfaceEndpoint/SecurityGroup",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        ToPort: 80,
      },
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::Vpc8378EB38::CdkStack-FargateServiceLBSecurityGroup5F444C78-1QV2YOS62F1B5",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
      },
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::Vpc8378EB38::CdkStack-FargateServiceSecurityGroup262B61DD-1VXQH2HSL89F2",
      securityGroupFrom: [
        "sg::Vpc8378EB38::CdkStack-FargateServiceLBSecurityGroup5F444C78-1QV2YOS62F1B5",
      ],
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 443,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "10.0.0.0/16",
          },
        ],
        ToPort: 443,
      },
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::Vpc8378EB38::CdkStack-VpcEbInterfaceEndpointSecurityGroupE08A80D2-7XKKU5JDDTFV",
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
      },
    }),
    dependencies: ({}) => ({
      securityGroup:
        "sg::Vpc8378EB38::CdkStack-FargateServiceLBSecurityGroup5F444C78-1QV2YOS62F1B5",
      securityGroupFrom: [
        "sg::Vpc8378EB38::CdkStack-FargateServiceSecurityGroup262B61DD-1VXQH2HSL89F2",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "VpcPublicSubnet1EIPD7E02669",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "VpcPublicSubnet2EIP3C605A87",
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    properties: ({ config, getId }) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Condition: {
              ArnEquals: {
                "aws:PrincipalArn": `${getId({
                  type: "Role",
                  group: "IAM",
                  name: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-MXDABPQLCXRL",
                })}`,
              },
            },
            Action: "events:PutEvents",
            Resource: `${getId({
              type: "EventBus",
              group: "CloudWatchEvents",
              name: "DemoEventBus",
            })}`,
            Effect: "Allow",
            Principal: {
              AWS: `*`,
            },
          },
        ],
      },
      PrivateDnsEnabled: true,
      RequesterManaged: false,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.events`,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
      subnets: [
        "Vpc8378EB38::VpcPrivateSubnet1Subnet536B997A",
        "Vpc8378EB38::VpcPrivateSubnet2Subnet3788AAA1",
      ],
      iamRoles: ["CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-MXDABPQLCXRL"],
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "CdkStack-ClusterEB0386A7-gyqzhZkvCS5B",
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({ config }) => ({
      containerDefinitions: [
        {
          command: [],
          cpu: 0,
          dnsSearchDomains: [],
          dnsServers: [],
          dockerLabels: {},
          dockerSecurityOptions: [],
          entryPoint: [],
          environment: [
            {
              name: "region",
              value: `${config.region}`,
            },
            {
              name: "eventBusName",
              value: "DemoEventBus",
            },
          ],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image: `840541460064.dkr.ecr.${config.region}.amazonaws.com/cdk-hnb659fds-container-assets-840541460064-${config.region}:a2ee93c23f547d6744410d73d5a2b81dc046717e7569d4e3f278f4d31e2f15bc`,
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-VaqaPjMDaE1N",
              "awslogs-region": `${config.region}`,
              "awslogs-stream-prefix": "FargateService",
            },
            secretOptions: [],
          },
          mountPoints: [],
          name: "web",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
          secrets: [],
          systemControls: [],
          ulimits: [],
          volumesFrom: [],
        },
      ],
      cpu: "512",
      family: "CdkStackFargateServiceTaskDef2C533A52",
      memory: "2048",
      networkMode: "awsvpc",
      requiresAttributes: [
        {
          name: "com.amazonaws.ecs.capability.logging-driver.awslogs",
        },
        {
          name: "ecs.capability.execution-role-awslogs",
        },
        {
          name: "com.amazonaws.ecs.capability.ecr-auth",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.19",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.17",
        },
        {
          name: "com.amazonaws.ecs.capability.task-iam-role",
        },
        {
          name: "ecs.capability.execution-role-ecr-pull",
        },
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.18",
        },
        {
          name: "ecs.capability.task-eni",
        },
      ],
      requiresCompatibilities: ["FARGATE"],
    }),
    dependencies: ({}) => ({
      taskRole: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-MXDABPQLCXRL",
      executionRole:
        "CdkStack-FargateServiceTaskDefExecutionRole9194820-138OPFQCAE04H",
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
            name: "CdkSt-Farga-18J680K747YUS",
          })}`,
        },
      ],
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "DISABLED",
        },
      },
      placementConstraints: [],
      placementStrategy: [],
      platformFamily: "Linux",
      platformVersion: "LATEST",
      schedulingStrategy: "REPLICA",
      serviceName: "CdkStack-FargateServiceECC8084D-cPBHY3hSlGgQ",
    }),
    dependencies: ({}) => ({
      cluster: "CdkStack-ClusterEB0386A7-gyqzhZkvCS5B",
      taskDefinition: "CdkStackFargateServiceTaskDef2C533A52",
      subnets: [
        "Vpc8378EB38::VpcPrivateSubnet1Subnet536B997A",
        "Vpc8378EB38::VpcPrivateSubnet2Subnet3788AAA1",
      ],
      securityGroups: [
        "sg::Vpc8378EB38::CdkStack-FargateServiceSecurityGroup262B61DD-1VXQH2HSL89F2",
      ],
      targetGroups: ["CdkSt-Farga-18J680K747YUS"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    name: "CdkSt-Farga-1U06CXLRFZ4ZC",
    properties: ({}) => ({
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({}) => ({
      subnets: [
        "Vpc8378EB38::VpcPublicSubnet1Subnet5C2D37C4",
        "Vpc8378EB38::VpcPublicSubnet2Subnet691E08A3",
      ],
      securityGroups: [
        "sg::Vpc8378EB38::CdkStack-FargateServiceLBSecurityGroup5F444C78-1QV2YOS62F1B5",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    name: "CdkSt-Farga-18J680K747YUS",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc8378EB38",
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
      loadBalancer: "CdkSt-Farga-1U06CXLRFZ4ZC",
      targetGroup: "CdkSt-Farga-18J680K747YUS",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-FargateServiceTaskDefExecutionRole9194820-138OPFQCAE04H",
    properties: ({ config, getId }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ecs-tasks.amazonaws.com`,
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
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `${getId({
                  type: "LogGroup",
                  group: "CloudWatchLogs",
                  name: "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-VaqaPjMDaE1N",
                })}:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefExecutionRoleDefaultPolicy827E7CA2",
        },
      ],
    }),
    dependencies: ({}) => ({
      logGroups: [
        "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-VaqaPjMDaE1N",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-MXDABPQLCXRL",
    properties: ({ getId }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ecs-tasks.amazonaws.com`,
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
                Action: "events:PutEvents",
                Resource: `${getId({
                  type: "EventBus",
                  group: "CloudWatchEvents",
                  name: "DemoEventBus",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefTaskRoleDefaultPolicy63F83D6F",
        },
      ],
    }),
    dependencies: ({}) => ({
      eventBus: "DemoEventBus",
    }),
  },
];
