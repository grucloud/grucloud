module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-volume",
  iam: {
    InstanceProfile: {
      myProfile: {
        name: "my-profile",
      },
    },
  },
  ec2: {
    Vpc: {
      vpcDefault: {
        name: "vpc-default",
      },
    },
    Volume: {
      volumeTestVolume: {
        name: "volume-test-volume",
        properties: {
          Size: 2,
          VolumeType: "standard",
        },
      },
    },
    SecurityGroup: {
      sgDefaultVpcDefault: {
        name: "sg-default-vpc-default",
      },
    },
    Instance: {
      server_4TestVolume: {
        name: "server-4-test-volume",
        properties: {
          InstanceType: "t2.micro",
          ImageId: "ami-084a1f89b0bb0f729",
        },
      },
    },
  },
});
