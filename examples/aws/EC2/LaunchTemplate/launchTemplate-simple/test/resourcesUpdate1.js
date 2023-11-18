exports.createResources = () => [
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({ getId }) => ({
      LaunchTemplateData: {
        NetworkInterfaces: [
          {
            DeviceIndex: 0,
            Groups: [
              `${getId({
                type: "SecurityGroup",
                group: "EC2",
                name: "sg::Vpc::EcsSecurityGroup",
              })}`,
            ],
            SubnetId: `${getId({
              type: "Subnet",
              group: "EC2",
              name: "Vpc::subnet-public",
            })}`,
          },
        ],
        InstanceType: "t2.small",
        UserData:
          "#!/bin/sh\nyum update -y\namazon-linux-extras install docker\nservice docker start\nusermod -a -G docker ec2-user\nchkconfig docker on",
        Image: {
          Description:
            "Amazon Linux 2 LTS Arm64 AMI 2.0.20220606.1 arm64 HVM gp2",
        },
      },
    }),
    dependencies: ({}) => ({
      subnets: ["Vpc::subnet-public"],
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
];
