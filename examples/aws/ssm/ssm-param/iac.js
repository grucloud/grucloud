const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.SSM.makeParameter({
    name: get("config.SSM.Parameter.textParam.name"),
    properties: get("config.SSM.Parameter.textParam.properties"),
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
