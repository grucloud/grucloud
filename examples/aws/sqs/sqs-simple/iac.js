const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider, resources: {} }) => {
  return {};
};
exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });

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
