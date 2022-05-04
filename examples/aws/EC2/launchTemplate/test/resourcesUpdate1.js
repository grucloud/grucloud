exports.createResources = () => [
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        Image: {
          Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
        },
        InstanceType: "t2.small",
      },
    }),
    dependencies: () => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
];
