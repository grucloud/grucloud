const assert = require("assert");
const { AzureProvider } = require("@grucloud/provider-azure");

const { createResources } = require("./resources");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AzureProvider, {
    createResources,
    config: require("./config"),
  });

  return {
    provider,
    hooks: [require("./hook")],
  };
};
