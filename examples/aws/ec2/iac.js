const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = require("./hooks");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const eip = await provider.makeElasticIpAddress({
    name: "ip-webserver",
    dependencies: {},
    properties: () => ({}),
  });

  return {
    eip,
    server: await provider.makeEC2({
      name: "web",
      dependencies: { keyPair, eip },
      properties: () => ({
        InstanceType: "t2.micro",
        ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
      }),
    }),
  };
};
exports.createResources = createResources;

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });
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
