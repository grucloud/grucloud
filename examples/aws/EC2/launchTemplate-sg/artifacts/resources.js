// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "KeyPair", group: "EC2", name: "kp-ecs" },
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-private",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}e`,
      CidrBlock: "10.0.0.0/24",
    }),
    dependencies: ({}) => ({
      vpc: "Vpc",
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
      securityGroup: "sg::Vpc::EcsSecurityGroup",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "ec2-template-sg",
    properties: ({ config, getId }) => ({
      Placement: {
        AvailabilityZone: `${config.region}e`,
      },
      LaunchTemplate: {
        LaunchTemplateId: `${getId({
          type: "LaunchTemplate",
          group: "EC2",
          name: "lt-ec2-micro",
        })}`,
        Version: "1",
      },
    }),
    dependencies: ({}) => ({
      subnets: ["subnet-private"],
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
      launchTemplate: "lt-ec2-micro",
    }),
  },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        InstanceType: "t2.micro",
        UserData:
          "#!/bin/sh\nyum update -y\namazon-linux-extras install docker\nservice docker start\nusermod -a -G docker ec2-user\nchkconfig docker on",
        Image: {
          Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
        },
      },
    }),
    dependencies: ({}) => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "role-ecs",
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
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "role-ecs",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      roles: ["role-ecs"],
    }),
  },
];