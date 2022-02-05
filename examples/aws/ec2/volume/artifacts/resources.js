// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.EC2.makeVolume({
    name: "volume-test-volume",
    properties: ({ config }) => ({
      Size: 2,
      VolumeType: "standard",
      AvailabilityZone: `${config.region}a`,
    }),
  });

  provider.EC2.makeInstance({
    name: "server-4-test-volume",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-02e136e904f3da870",
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
    }),
    dependencies: () => ({
      volumes: ["volume-test-volume"],
    }),
  });
};

exports.createResources = createResources;
