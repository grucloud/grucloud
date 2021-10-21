const createResources = ({ provider }) => {
  provider.EC2.makeVolume({
    name: "volume-test-volume",
    properties: () => ({
      Size: 2,
      VolumeType: "standard",
      AvailabilityZone: "eu-west-2a",
    }),
  });

  provider.EC2.makeInstance({
    name: "server-4-test-volume",
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-056bfe7d8a7bdb9d0",
    }),
    dependencies: ({ resources }) => ({
      volumes: [resources.EC2.Volume.volumeTestVolume],
    }),
  });
};

exports.createResources = createResources;
