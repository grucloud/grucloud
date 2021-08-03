const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const server = provider.compute.makeVmInstance({
    name: config.vm.name,
    properties: () => config.vm.properties,
  });

  return {
    server,
  };
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
  };
};
