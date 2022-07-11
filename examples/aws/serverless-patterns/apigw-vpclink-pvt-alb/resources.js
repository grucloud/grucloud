// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Api", group: "ApiGatewayV2", name: "serverlessland-pvt-endpoint" },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "$default",
    properties: ({}) => ({
      AutoDeploy: true,
    }),
    dependencies: ({}) => ({
      api: "serverlessland-pvt-endpoint",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "VPC_LINK",
      IntegrationMethod: "ANY",
      IntegrationType: "HTTP_PROXY",
      PayloadFormatVersion: "1.0",
      RequestTemplates: {},
    }),
    dependencies: ({}) => ({
      api: "serverlessland-pvt-endpoint",
      listener: "listener::sam-a-LoadB-EC9ZTKNG2RSH::HTTP::80",
      vpcLink: "APIGWVpcLinkToPrivateHTTPEndpoint",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      RouteKey: "ANY /{proxy+}",
    }),
    dependencies: ({}) => ({
      api: "serverlessland-pvt-endpoint",
      integration:
        "integration::serverlessland-pvt-endpoint::listener::sam-a-LoadB-EC9ZTKNG2RSH::HTTP::80",
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
      api: "serverlessland-pvt-endpoint",
      stage: "$default",
    }),
  },
  {
    type: "VpcLink",
    group: "ApiGatewayV2",
    name: "APIGWVpcLinkToPrivateHTTPEndpoint",
    dependencies: ({ config }) => ({
      subnets: [
        `vpclink-ex-vpc::vpclink-ex-subnet-private1-${config.region}a`,
        `vpclink-ex-vpc::vpclink-ex-subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpclink-ex-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpclink-ex-vpc::vpclink-ex-subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      CidrBlock: "10.0.128.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) =>
      `vpclink-ex-vpc::vpclink-ex-subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      CidrBlock: "10.0.144.0/20",
    }),
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpclink-ex-vpc::vpclink-ex-rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) =>
      `vpclink-ex-vpc::vpclink-ex-rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpclink-ex-vpc::vpclink-ex-rtb-private1-${config.region}a`,
      subnet: `vpclink-ex-vpc::vpclink-ex-subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpclink-ex-vpc::vpclink-ex-rtb-private2-${config.region}b`,
      subnet: `vpclink-ex-vpc::vpclink-ex-subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ",
      Description: "ECS Security Group",
    }),
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "sam-app-LoadBalancerSG-10GJVKU6RNTZ4",
      Description: "LoadBalancer Security Group",
    }),
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
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
        "sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ",
      securityGroupFrom: [
        "sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4",
      ],
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
    dependencies: ({}) => ({
      securityGroup: "sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4",
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
      securityGroup: "sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4",
      securityGroupFrom: [
        "sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ",
      ],
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    name: "sam-app-ECSFargateCluster-iqHkBgW4h6Go",
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
    name: "sam-app-ECSServiceTaskDefinition-7P836RFsrg3O",
    properties: ({}) => ({
      containerDefinitions: [
        {
          command: [],
          cpu: 0,
          dnsSearchDomains: [],
          dnsServers: [],
          dockerLabels: {},
          dockerSecurityOptions: [],
          entryPoint: [],
          environment: [],
          environmentFiles: [],
          essential: true,
          extraHosts: [],
          image: `nginx`,
          links: [],
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
      family: "sam-app-ECSServiceTaskDefinition-7P836RFsrg3O",
      memory: "1024",
      networkMode: "awsvpc",
      requiresAttributes: [
        {
          name: "com.amazonaws.ecs.capability.docker-remote-api.1.17",
        },
        {
          name: "com.amazonaws.ecs.capability.task-iam-role",
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
      taskRole: "sam-app-ECSTaskRole-1PCVBVKCZRWS2",
      executionRole: "sam-app-ECSTaskExecutionRole-PMX4OZKH4A2P",
    }),
  },
  {
    type: "Service",
    group: "ECS",
    name: "sam-app-ECSService-dVx4w3SfxVcU",
    properties: ({ getId }) => ({
      deploymentConfiguration: {
        deploymentCircuitBreaker: {
          enable: false,
          rollback: false,
        },
        maximumPercent: 200,
        minimumHealthyPercent: 50,
      },
      desiredCount: 2,
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
            name: "sam-a-LoadB-29TIQLVPQQY9",
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
      serviceName: "sam-app-ECSService-dVx4w3SfxVcU",
    }),
    dependencies: ({ config }) => ({
      cluster: "sam-app-ECSFargateCluster-iqHkBgW4h6Go",
      taskDefinition: "sam-app-ECSServiceTaskDefinition-7P836RFsrg3O",
      subnets: [
        `vpclink-ex-vpc::vpclink-ex-subnet-private1-${config.region}a`,
        `vpclink-ex-vpc::vpclink-ex-subnet-private2-${config.region}b`,
      ],
      securityGroups: [
        "sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ",
      ],
      targetGroups: ["sam-a-LoadB-29TIQLVPQQY9"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    name: "sam-a-LoadB-EC9ZTKNG2RSH",
    properties: ({}) => ({
      Scheme: "internal",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpclink-ex-vpc::vpclink-ex-subnet-private1-${config.region}a`,
        `vpclink-ex-vpc::vpclink-ex-subnet-private2-${config.region}b`,
      ],
      securityGroups: [
        "sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4",
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    name: "sam-a-LoadB-29TIQLVPQQY9",
    properties: ({}) => ({
      Protocol: "HTTP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      TargetType: "ip",
    }),
    dependencies: ({}) => ({
      vpc: "vpclink-ex-vpc",
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
      loadBalancer: "sam-a-LoadB-EC9ZTKNG2RSH",
      targetGroup: "sam-a-LoadB-29TIQLVPQQY9",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-ECSTaskExecutionRole-PMX4OZKH4A2P",
    properties: ({}) => ({
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
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "sam-app-ECSTaskRole-1PCVBVKCZRWS2",
    properties: ({}) => ({
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
    }),
  },
];
