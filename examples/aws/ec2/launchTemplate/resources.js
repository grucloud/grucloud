const createResources = ({ provider }) => {
  provider.IAM.makeRole({
    name: "role-ecs",
    properties: () => ({
      RoleName: "role-ecs",
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
      roles: [resources.IAM.Role.roleEcs],
    }),
  });

  provider.EC2.makeVpc({
    name: "Vpc",
    properties: () => ({
      CidrBlock: "10.0.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeSubnet({
    name: "PubSubnetAz1",
    properties: () => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: "eu-west-2a",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSubnet({
    name: "PubSubnetAz2",
    properties: () => ({
      CidrBlock: "10.0.1.0/24",
      AvailabilityZone: "eu-west-2b",
      MapPublicIpOnLaunch: false,
      MapCustomerOwnedIpOnLaunch: false,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeKeyPair({
    name: "kp-ecs",
  });

  provider.EC2.makeSecurityGroup({
    name: "EcsSecurityGroup",
    properties: () => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "EcsSecurityGroup-rule-ingress-tcp-80-v4",
    properties: () => ({
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
      securityGroup: resources.EC2.SecurityGroup.ecsSecurityGroup,
    }),
  });

  provider.EC2.makeLaunchTemplate({
    name: "lt-ec2-micro",
    properties: () => ({
      LaunchTemplateData: {
        EbsOptimized: false,
        ImageId: "ami-0d26eb3972b7f8c96",
        InstanceType: "t2.micro",
        KeyName: "kp-ecs",
      },
    }),
    dependencies: ({ resources }) => ({
      keyPair: resources.EC2.KeyPair.kpEcs,
      iamInstanceProfile: resources.IAM.InstanceProfile.roleEcs,
    }),
  });
};

exports.createResources = createResources;
