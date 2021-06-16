const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const Device = "/dev/sdf";
const deviceMounted = "/dev/xvdf";
const mountPoint = "/data";
const formatName = (name) => `${name}-test-volume`;
const createResources = async ({ provider, resources: {} }) => {
  const { config } = provider;
  assert(config.region);
  assert(config.availabilityZoneSuffix);
  const AvailabilityZone = `${config.region}${config.availabilityZoneSuffix}`;

  const volume = await provider.makeVolume({
    name: formatName("volume"),
    properties: () => ({
      Size: 2,
      VolumeType: "standard",
      Device,
      AvailabilityZone,
    }),
  });

  const image = await provider.useImage({
    name: "Amazon Linux 2",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "description",
          Values: ["Amazon Linux 2 AMI *"],
        },
      ],
    }),
  });

  const server = await provider.makeEC2({
    name: formatName("server-4"),
    dependencies: { image, volumes: [volume] },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
      Placement: { AvailabilityZone },
    }),
  });

  return {
    server,
    volume,
  };
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });

  const resources = await createResources({ provider, resources: {} });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
