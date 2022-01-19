// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.AutoScaling.makeAutoScalingGroup({
    name: "asg",
    properties: ({}) => ({
      MinSize: 1,
      MaxSize: 1,
      DesiredCapacity: 1,
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet["PubSubnetAz1"],
        resources.EC2.Subnet["PubSubnetAz2"],
      ],
      launchTemplate: resources.EC2.LaunchTemplate["lt-ec2-micro"],
    }),
  });

  provider.EC2.makeKeyPair({
    name: "kp-ecs",
  });

  provider.EC2.makeVpc({
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeSubnet({
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["Vpc"],
    }),
  });

  provider.EC2.makeSubnet({
    name: "PubSubnetAz2",
    properties: ({ config }) => ({
      CidrBlock: "10.0.1.0/24",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["Vpc"],
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "EcsSecurityGroup",
    properties: ({}) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["Vpc"],
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "EcsSecurityGroup-rule-ingress-tcp-80-v4",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 80,
        ToPort: 80,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup["EcsSecurityGroup"],
    }),
  });

  provider.EC2.makeLaunchTemplate({
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        ImageId: "ami-02e136e904f3da870",
        InstanceType: "t2.micro",
      },
    }),
    dependencies: ({ resources }) => ({
      keyPair: resources.EC2.KeyPair["kp-ecs"],
      iamInstanceProfile: resources.IAM.InstanceProfile["role-ecs"],
    }),
  });

  provider.IAM.makeRole({
    name: "role-ecs",
    properties: ({}) => ({
      Path: "/",
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
    }),
  });

  provider.IAM.makeInstanceProfile({
    name: "role-ecs",
    dependencies: ({ resources }) => ({
      roles: [resources.IAM.Role["role-ecs"]],
    }),
  });
};

exports.createResources = createResources;
