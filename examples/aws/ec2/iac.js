const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: { keyPair } }) => {
  return {
    dbServer: await provider.makeEC2({
      name: "db-server",
      dependencies: { keyPair },
      properties: () => ({
        VolumeSize: 50,
        InstanceType: "t2.micro",
        ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
      }),
    }),
  };
};

exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  return {
    providers: [provider],
    resources: await createResources({ provider, resources: { keyPair } }),
  };
};
