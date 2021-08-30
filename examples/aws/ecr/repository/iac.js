const { AwsProvider } = require("@grucloud/provider-aws");

//TODO get config from parameter
const createResources = ({ provider }) => {
  const { getConfig } = provider;
  provider.ecr.makeRepository({
    name: provider.config.ecr.Repository.starhackitLb.name,
    properties: ({ config }) => config.ecr.Repository.starhackitLb.properties,
  });

  provider.ecr.makeRegistry({
    name: getConfig().ecr.Registry.default.name,
    properties: () => getConfig().ecr.Registry.default.properties,
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
