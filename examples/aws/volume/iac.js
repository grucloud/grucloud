const { AwsProvider } = require("@grucloud/core");
const hooks = require("./hooks");

const Device = "/dev/sdf";
const deviceMounted = "/dev/xvdf";
const mountPoint = "/data";

const createResources = async ({ provider, resources: { keyPair } }) => {
  const volume = await provider.makeVolume({
    name: "volume",
    properties: () => ({
      Size: 2,
      VolumeType: "standard",
      Device,
    }),
  });

  const server = await provider.makeEC2({
    name: "server-4-volume",
    dependencies: { keyPair, volumes: [volume] },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
    }),
  });

  return {
    server,
    volume,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({ config });
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });
  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks,
  };
};
