module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-volume",
  ec2: {
    Volume: {
      volumeTestVolume: {
        name: "volume-test-volume",
        properties: {
          Size: 2,
          VolumeType: "standard",
          AvailabilityZone: "eu-west-2a",
        },
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
