const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const server = await provider.makeEC2({
    name: "server-4-volume",
    dependencies: { keyPair },
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
    }),
  });

  const volume = await provider.makeVolume({
    name: "volume",
    dependencies: { ec2Instance: server },
    properties: () => ({
      Size: 2,
      VolumeType: "standard",
      Device: "/dev/sdf",
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
  };
};
