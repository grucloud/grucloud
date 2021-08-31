const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

exports.config = require("./config");

const createResources = async ({ provider }) => {
  const { config } = provider;
  provider.CognitoIdentityServiceProvider.makeUserPool({
    name: "userpool-test",
    properties: () => ({}),
  });

  return {};
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  // Create a AWS provider
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider, resources: {} });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
