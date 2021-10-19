const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

const createResources = async ({ provider, resources: {} }) => {
  return {};
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
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
