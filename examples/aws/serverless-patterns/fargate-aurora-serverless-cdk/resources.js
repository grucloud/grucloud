// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-LeR3z3gTutTd",
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "CdkStack/Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "CdkStack/Vpc",
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet1",
    dependencies: () => ({
      subnet: "CdkStack/Vpc/PublicSubnet1",
      eip: "CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet2",
    dependencies: () => ({
      subnet: "CdkStack/Vpc/PublicSubnet2",
      eip: "CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc/PrivateSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.128.0/18",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc/PrivateSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.192.0/18",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/18",
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.64.0/18",
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc/PrivateSubnet1",
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc/PrivateSubnet2",
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet1",
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet2",
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PrivateSubnet1",
      subnet: "CdkStack/Vpc/PrivateSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PrivateSubnet2",
      subnet: "CdkStack/Vpc/PrivateSubnet2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PublicSubnet1",
      subnet: "CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PublicSubnet2",
      subnet: "CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PrivateSubnet1",
      natGateway: "CdkStack/Vpc/PublicSubnet1",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PrivateSubnet2",
      natGateway: "CdkStack/Vpc/PublicSubnet2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PublicSubnet1",
      ig: "CdkStack/Vpc",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "CdkStack/Vpc/PublicSubnet2",
      ig: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "CdkStack-AuroraServerlessClusterSecurityGroup5A67466E-11JEB9PLM8T9V",
    properties: ({}) => ({
      Description: "RDS security group",
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "CdkStack-FargateServiceLBSecurityGroup5F444C78-6BGFMDZ87GPX",
    properties: ({}) => ({
      Description:
        "Automatically created Security Group for ELB CdkStackFargateServiceLB29CE988E",
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "CdkStack-FargateServiceSecurityGroup262B61DD-11KWJT85SGW74",
    properties: ({}) => ({
      Description: "CdkStack/FargateService/Service/SecurityGroup",
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
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
            Description: "Allow from anyone on port 80",
          },
        ],
        ToPort: 80,
      },
    }),
    dependencies: () => ({
      securityGroup:
        "CdkStack-FargateServiceLBSecurityGroup5F444C78-6BGFMDZ87GPX",
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
    dependencies: () => ({
      securityGroup:
        "CdkStack-FargateServiceSecurityGroup262B61DD-11KWJT85SGW74",
      securityGroupFrom: [
        "CdkStack-FargateServiceLBSecurityGroup5F444C78-6BGFMDZ87GPX",
      ],
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
    dependencies: () => ({
      securityGroup:
        "CdkStack-FargateServiceLBSecurityGroup5F444C78-6BGFMDZ87GPX",
      securityGroupFrom: [
        "CdkStack-FargateServiceSecurityGroup262B61DD-11KWJT85SGW74",
      ],
    }),
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet1",
  },
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "CdkStack/Vpc/PublicSubnet2",
  },
  {
    type: "VpcEndpoint",
    group: "EC2",
    name: "com.amazonaws.vpce.us-east-1.vpce-svc-0ff33532fa2a4a999",
    properties: ({}) => ({
      ServiceName: "com.amazonaws.vpce.us-east-1.vpce-svc-0ff33532fa2a4a999",
      PolicyDocument: {
        Statement: [
          {
            Action: "*",
            Effect: "Allow",
            Principal: "*",
            Resource: `*`,
          },
        ],
      },
      PrivateDnsEnabled: false,
      RequesterManaged: true,
      VpcEndpointType: "Interface",
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
      subnets: ["CdkStack/Vpc/PrivateSubnet1", "CdkStack/Vpc/PrivateSubnet2"],
    }),
  },
  {
    type: "Repository",
    group: "ECR",
    name: "aws-cdk/assets",
    properties: ({}) => ({
      imageTagMutability: "MUTABLE",
      imageScanningConfiguration: {
        scanOnPush: true,
      },
      encryptionConfiguration: {
        encryptionType: "AES256",
      },
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    name: "CdkStack-ClusterEB0386A7-VHj5aFHGogSe",
    properties: ({}) => ({
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
    name: "CdkStackFargateServiceTaskDef2C533A52",
    properties: ({ getId }) => ({
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
              name: "dbClusterArn",
              value: `${getId({
                type: "DBCluster",
                group: "RDS",
                name: "cdkstack-auroraserverlessclusterb4a18ef1-hn3j216axa36",
              })}`,
            },
            {
              name: "secretArn",
              value: `${getId({
                type: "Secret",
                group: "SecretsManager",
                name: "aurora-user-secret",
              })}`,
            },
            {
              name: "dbName",
              value: "aurora_db",
            },
          ],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image:
            "840541460064.dkr.ecr.us-east-1.amazonaws.com/aws-cdk/assets:ad758bca7c4674905c156fb09c1cdc499a660e8bd2f563b4a0987f2385ecaf90",
          links: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group":
                "CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-LeR3z3gTutTd",
              "awslogs-region": "us-east-1",
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
    dependencies: () => ({
      secret: "aurora-user-secret",
      rdsDbCluster: "cdkstack-auroraserverlessclusterb4a18ef1-hn3j216axa36",
      taskRole: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-1I13W56GTB71S",
      executionRole:
        "CdkStack-FargateServiceTaskDefExecutionRole9194820-109N4DKVMHG1M",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    name: "CdkStack-FargateServiceECC8084D-vbBQwtRLsYBm",
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
            group: "ELBv2",
            name: "CdkSt-Farga-F9TYJDF7M1SI",
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
      serviceName: "CdkStack-FargateServiceECC8084D-vbBQwtRLsYBm",
    }),
    dependencies: () => ({
      cluster: "CdkStack-ClusterEB0386A7-VHj5aFHGogSe",
      taskDefinition: "CdkStackFargateServiceTaskDef2C533A52",
      subnets: ["CdkStack/Vpc/PrivateSubnet1", "CdkStack/Vpc/PrivateSubnet2"],
      securityGroups: [
        "CdkStack-FargateServiceSecurityGroup262B61DD-11KWJT85SGW74",
      ],
      targetGroups: ["CdkSt-Farga-F9TYJDF7M1SI"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ELBv2",
    name: "CdkSt-Farga-S1JFFK5YDTJC",
    properties: ({}) => ({
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: () => ({
      subnets: ["CdkStack/Vpc/PublicSubnet1", "CdkStack/Vpc/PublicSubnet2"],
      securityGroups: [
        "CdkStack-FargateServiceLBSecurityGroup5F444C78-6BGFMDZ87GPX",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ELBv2",
    name: "CdkSt-Farga-F9TYJDF7M1SI",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: () => ({
      vpc: "CdkStack/Vpc",
    }),
  },
  {
    type: "Listener",
    group: "ELBv2",
    properties: ({}) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: () => ({
      loadBalancer: "CdkSt-Farga-S1JFFK5YDTJC",
      targetGroup: "CdkSt-Farga-F9TYJDF7M1SI",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-FargateServiceTaskDefExecutionRole9194820-109N4DKVMHG1M",
    properties: ({ config }) => ({
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
                }:${config.accountId()}:repository/aws-cdk/assets`,
                Effect: "Allow",
              },
              {
                Action: "ecr:GetAuthorizationToken",
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                Resource: `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:log-group:CdkStack-FargateServiceTaskDefwebLogGroup71FAF541-LeR3z3gTutTd:*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefExecutionRoleDefaultPolicy827E7CA2",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "CdkStack-FargateServiceTaskDefTaskRole8CDCF85E-1I13W56GTB71S",
    properties: ({ config }) => ({
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
                  "rds-data:BatchExecuteStatement",
                  "rds-data:BeginTransaction",
                  "rds-data:CommitTransaction",
                  "rds-data:ExecuteStatement",
                  "rds-data:RollbackTransaction",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: [
                  "secretsmanager:GetSecretValue",
                  "secretsmanager:DescribeSecret",
                ],
                Resource: `arn:aws:secretsmanager:${
                  config.region
                }:${config.accountId()}:secret:aurora-user-secret-kmA8oG`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "FargateServiceTaskDefTaskRoleDefaultPolicy63F83D6F",
        },
      ],
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    name: "cdkstack-auroraserverlessclustersubnets734af39a-wrxm6th5wqjh",
    properties: ({}) => ({
      DBSubnetGroupDescription: "Subnets for AuroraServerlessCluster database",
    }),
    dependencies: () => ({
      subnets: ["CdkStack/Vpc/PrivateSubnet1", "CdkStack/Vpc/PrivateSubnet2"],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    name: "cdkstack-auroraserverlessclusterb4a18ef1-hn3j216axa36",
    properties: ({}) => ({
      AllocatedStorage: 1,
      DatabaseName: "aurora_db",
      Engine: "aurora",
      EngineVersion: "5.6.10a",
      Port: 3306,
      MasterUsername:
        process.env
          .CDKSTACK_AURORASERVERLESSCLUSTERB4A18EF1_HN3J216AXA36_MASTER_USERNAME,
      PreferredBackupWindow: "04:06-04:36",
      PreferredMaintenanceWindow: "sun:03:14-sun:03:44",
      EngineMode: "serverless",
      HttpEndpointEnabled: true,
      AutoMinorVersionUpgrade: false,
      ScalingConfiguration: {
        MinCapacity: 1,
        MaxCapacity: 2,
        SecondsUntilAutoPause: 600,
      },
      MasterUserPassword:
        process.env
          .CDKSTACK_AURORASERVERLESSCLUSTERB4A18EF1_HN3J216AXA36_MASTER_USER_PASSWORD,
    }),
    dependencies: () => ({
      dbSubnetGroup:
        "cdkstack-auroraserverlessclustersubnets734af39a-wrxm6th5wqjh",
      securityGroups: [
        "CdkStack-AuroraServerlessClusterSecurityGroup5A67466E-11JEB9PLM8T9V",
      ],
      secret: "aurora-user-secret",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    name: "aurora-user-secret",
    properties: ({ generatePassword }) => ({
      SecretString: {
        password: generatePassword({ length: 30 }),
        dbname: "aurora_db",
        engine: "mysql",
        port: 3306,
        username: "admin",
      },
      Description: "RDS database auto-generated user password",
    }),
  },
];
