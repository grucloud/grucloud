exports.createResources = () => [
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        ImageId: "ami-02e136e904f3da870",
        InstanceType: "t2.small",
      },
    }),
    dependencies: () => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["EcsSecurityGroup"],
    }),
  },
];
