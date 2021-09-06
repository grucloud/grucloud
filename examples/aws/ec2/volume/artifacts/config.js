module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-volume",
  EC2: {
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
          ImageId: "ami-056bfe7d8a7bdb9d0",
        },
      },
    },
  },
});
