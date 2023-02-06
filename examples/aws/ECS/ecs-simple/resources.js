// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "EcsInstanceAsg",
    properties: ({}) => ({
      MinSize: 0,
      MaxSize: 1,
      DesiredCapacity: 1,
      HealthCheckGracePeriod: 0,
    }),
    dependencies: ({}) => ({
      subnets: ["Vpc::PubSubnetAz1", "Vpc::PubSubnetAz2"],
      launchConfiguration:
        "EC2ContainerService-cluster-EcsInstanceLc-COYK3CQZ0QRJ",
    }),
  },
  {
    type: "LaunchConfiguration",
    group: "AutoScaling",
    properties: ({}) => ({
      LaunchConfigurationName:
        "EC2ContainerService-cluster-EcsInstanceLc-COYK3CQZ0QRJ",
      UserData: `Content-Type: multipart/mixed; boundary="1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3"
MIME-Version: 1.0

--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3
Content-Type: text/text/x-shellscript; charset="utf-8"
Mime-Version: 1.0


#!/bin/bash
echo ECS_CLUSTER=cluster >> /etc/ecs/ecs.config
echo 'ECS_CONTAINER_INSTANCE_TAGS={"my-tag":"my-value"}' >> /etc/ecs/ecs.config
--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3--`,
      InstanceType: "t2.micro",
      BlockDeviceMappings: [
        {
          DeviceName: "/dev/xvda",
          Ebs: {
            VolumeSize: 30,
            VolumeType: "gp2",
          },
        },
      ],
      InstanceMonitoring: {
        Enabled: true,
      },
      EbsOptimized: false,
      Image: {
        Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
      },
    }),
    dependencies: ({}) => ({
      instanceProfile: "ecsInstanceRole",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({}) => ({
      AlarmName: "alarm-ecs-cpu",
      MetricName: "CPUReservation",
      Namespace: "AWS/ECS",
      Statistic: "Average",
      Dimensions: [
        {
          Value: "my-cluster",
          Name: "ClusterName",
        },
      ],
      Period: 300,
      EvaluationPeriods: 1,
      DatapointsToAlarm: 1,
      Threshold: 80,
      ComparisonOperator: "GreaterThanThreshold",
      TreatMissingData: "missing",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "InternetGateway" },
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
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
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
    name: "PubSubnetAz2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      MapPublicIpOnLaunch: true,
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
    name: "RouteViaIgw",
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
      ig: "InternetGateway",
      routeTable: "Vpc::RouteViaIgw",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "EcsSecurityGroup",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
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
        },
      ],
      ToPort: 80,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::Vpc::EcsSecurityGroup",
    }),
  },
  {
    type: "CapacityProvider",
    group: "ECS",
    properties: ({}) => ({
      name: "cp",
      autoScalingGroupProvider: {
        managedScaling: {
          instanceWarmupPeriod: 300,
          maximumScalingStepSize: 10000,
          minimumScalingStepSize: 1,
          status: "ENABLED",
          targetCapacity: 95,
        },
        managedTerminationProtection: "DISABLED",
      },
      tags: [
        {
          key: "mykey",
          value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      autoScalingGroup: "EcsInstanceAsg",
    }),
  },
  {
    type: "Cluster",
    group: "ECS",
    properties: ({}) => ({
      clusterName: "cluster",
      settings: [
        {
          name: "containerInsights",
          value: "enabled",
        },
      ],
      capacityProviders: ["cp"],
      tags: [
        {
          key: "mykey",
          value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      capacityProviders: ["cp"],
    }),
  },
  {
    type: "Service",
    group: "ECS",
    properties: ({}) => ({
      deploymentConfiguration: {
        alarms: {
          alarmNames: ["alarm-ecs-cpu"],
          enable: true,
          rollback: false,
        },
        deploymentCircuitBreaker: {
          enable: false,
          rollback: false,
        },
        maximumPercent: 200,
        minimumHealthyPercent: 100,
      },
      desiredCount: 1,
      enableECSManagedTags: true,
      enableExecuteCommand: false,
      launchType: "EC2",
      placementStrategy: [
        {
          field: "attribute:ecs.availability-zone",
          type: "spread",
        },
        {
          field: "instanceId",
          type: "spread",
        },
      ],
      schedulingStrategy: "REPLICA",
      serviceName: "service-nginx",
      tags: [
        {
          key: "mykey",
          value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      alarms: ["alarm-ecs-cpu"],
      cluster: "cluster",
      taskDefinition: "nginx",
    }),
  },
  {
    type: "TaskDefinition",
    group: "ECS",
    properties: ({}) => ({
      containerDefinitions: [
        {
          cpu: 0,
          essential: true,
          image: "nginx",
          memory: 512,
          name: "nginx",
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
        },
      ],
      family: "nginx",
      tags: [
        {
          key: "mykey",
          value: "value",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ecsInstanceRole",
      AssumeRolePolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "",
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
          PolicyName: "AmazonEC2ContainerServiceforEC2Role",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
        },
      ],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "ecsInstanceRole",
    dependencies: ({}) => ({
      roles: ["ecsInstanceRole"],
    }),
  },
];
