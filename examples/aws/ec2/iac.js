const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  const eip = await provider.makeElasticIpAddress({
    name: config.eip.name,
  });

  return {
    eip,
    ec2Instance: await provider.makeEC2({
      name: config.ec2Instance.name,
      dependencies: { keyPair, eip },
      properties: config.ec2Instance.properties,
    }),
  };
};
exports.createResources = createResources;

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });
  const keyPair = await provider.useKeyPair({
    name: provider.config.keyPair.name,
  });
  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
