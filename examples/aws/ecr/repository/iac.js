const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.ECR.makeRepository({
    name: get("config.ECR.Repository.starhackitLb.name"),
    properties: get("config.ECR.Repository.starhackitLb.properties"),
  });

  provider.ECR.makeRegistry({
    name: get("config.ECR.Registry.default.name"),
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
