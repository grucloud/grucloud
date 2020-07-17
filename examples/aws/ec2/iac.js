const { AwsProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });

  // SSH Key pair
  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  // Allocate a server
  const server = await provider.makeEC2({
    name: "web-server",
    dependencies: { keyPair },
    properties: () => ({
      VolumeSize: 50,
      InstanceType: "t2.micro",
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    }),
  });

  return { providers: [provider] };
};
