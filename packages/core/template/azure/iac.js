const assert = require("assert");
const { AzureProvider } = require("@grucloud/provider-azure");
const hook = require("./hook");

const createResources = async ({ provider, resources: {} }) => {
  return {};
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AzureProvider, {
    config: require("./config"),
  });

  const resources = await createResources({
    provider,
    resources: {},
  });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
