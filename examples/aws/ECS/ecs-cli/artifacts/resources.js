// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceAsg-E1YAIKY8YI41",
    properties: ({}) => ({
      MinSize: 0,
      MaxSize: 1,
      DesiredCapacity: 1,
      HealthCheckGracePeriod: 0,
    }),
    dependencies: ({}) => ({
      subnets: ["Vpc::PubSubnetAz1", "Vpc::PubSubnetAz2"],
      launchConfiguration:
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-HWVeTO3QcmK1",
    }),
  },
  {
    type: "LaunchConfiguration",
    group: "AutoScaling",
    properties: ({}) => ({
      LaunchConfigurationName:
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-HWVeTO3QcmK1",
      UserData:
        'Content-Type: multipart/mixed; boundary="9d473c52461ae3bbe1e3ac2cf352ccaee391db0c1d2135a7967b4fe54feb"\nMIME-Version: 1.0\n\n--9d473c52461ae3bbe1e3ac2cf352ccaee391db0c1d2135a7967b4fe54feb\nContent-Type: text/text/x-shellscript; charset="utf-8"\nMime-Version: 1.0\n\n\n#!/bin/bash\necho ECS_CLUSTER=my-cluster >> /etc/ecs/ecs.config\necho \'ECS_CONTAINER_INSTANCE_TAGS={"my-tag":"my-value"}\' >> /etc/ecs/ecs.config\n--9d473c52461ae3bbe1e3ac2cf352ccaee391db0c1d2135a7967b4fe54feb--',
      InstanceType: "t2.small",
      BlockDeviceMappings: [],
      InstanceMonitoring: {
        Enabled: true,
      },
      EbsOptimized: false,
      AssociatePublicIpAddress: true,
      Image: {
        Description: "Amazon Linux AMI 2.0.20220209 x86_64 ECS HVM GP2",
      },
    }),
    dependencies: ({}) => ({
      instanceProfile:
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-1V2DBJVUCN7IT",
      securityGroups: [
        "sg::Vpc::amazon-ecs-cli-setup-my-cluster-EcsSecurityGroup-1M3ZGBGN81ILF",
      ],
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "InternetGateway",
    properties: ({}) => ({
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "Vpc",
      internetGateway: "InternetGateway",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc::PubSubnetAz1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Vpc::PubSubnetAz2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Vpc::RouteViaIgw",
    properties: ({}) => ({
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc::RouteViaIgw",
      subnet: "Vpc::PubSubnetAz1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "Vpc::RouteViaIgw",
      subnet: "Vpc::PubSubnetAz2",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "Vpc::RouteViaIgw",
      ig: "InternetGateway",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName:
        "amazon-ecs-cli-setup-my-cluster-EcsSecurityGroup-1M3ZGBGN81ILF",
      Description: "ECS Allowed Ports",
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
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
        "sg::Vpc::amazon-ecs-cli-setup-my-cluster-EcsSecurityGroup-1M3ZGBGN81ILF",
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "my-cluster",
      settings: [
        {
          name: "containerInsights",
          value: "disabled",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-TERDPQNAO5Q2",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ec2.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEC2ContainerServiceforEC2Role",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
        },
      ],
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-1V2DBJVUCN7IT",
    dependencies: ({}) => ({
      roles: ["amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-TERDPQNAO5Q2"],
    }),
  },
];
