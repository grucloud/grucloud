const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

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
    name: "server-4-volume",
    dependencies: { image, keyPair, volumes: [volume] },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
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
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });
  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
