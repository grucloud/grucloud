const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

exports.config = require("./config");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;
  assert(config.eip);
  const eip = provider.ec2.makeElasticIpAddress({
    name: config.eip.name,
  });

  const image = provider.ec2.useImage({
    name: "Amazon Linux 2",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "owner-alias",
          Values: ["amazon"],
        },
        {
          Name: "description",
          Values: ["Amazon Linux 2 AMI *"],
        },
      ],
    }),
  });

  const ec2Instance = provider.ec2.makeInstance({
    name: config.ec2Instance.name,
    dependencies: { keyPair, eip, image },
    properties: config.ec2Instance.properties,
  });

  return {
    eip,
    ec2Instance,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create a AWS provider
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const keyPair = provider.ec2.makeKeyPair({
    name: provider.config.keyPair.name,
  });
  const resources = await createResources({ provider, resources: { keyPair } });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
