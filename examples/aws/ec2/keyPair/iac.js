const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

exports.config = require("./config");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const keyPair = provider.ec2.makeKeyPair({
    name: config.keyPair.name,
  });

  return {
    keyPair,
  };
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create a AWS provider
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = createResources({ provider });
  return {
    provider,
    resources,
    hooks: [hook],
  };
};
