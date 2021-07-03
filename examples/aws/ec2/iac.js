const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

exports.config = require("./config");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  assert(config.eip);
  const eip = await provider.ec2.makeElasticIpAddress({
    name: config.eip.name,
  });

  const image = await provider.ec2.useImage({
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
    ec2Instance: await provider.ec2.makeInstance({
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
  const keyPair = await provider.ec2.useKeyPair({
    name: provider.config.keyPair.name,
  });
  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
