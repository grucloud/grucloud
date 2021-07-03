const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const server = await provider.compute.makeVmInstance({
    name: config.vm.name,
    properties: () => config.vm.properties,
  });

  return {
    server,
  };
};

exports.createStack = async ({ config, stage }) => {
  const provider = GoogleProvider({ config, stage });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
  };
};
