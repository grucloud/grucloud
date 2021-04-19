const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

exports.config = require("./config");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  assert(config.eip);
  const eip = await provider.makeElasticIpAddress({
    name: config.eip.name,
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

  return {
    eip,
    ec2Instance: await provider.makeEC2({
      name: config.ec2Instance.name,
      dependencies: { keyPair, eip, image },
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
