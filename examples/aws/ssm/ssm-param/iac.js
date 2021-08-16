const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.ssm.makeParameter({
    name: get("config.ssm.Parameter.textParam.name"),
    properties: get("config.ssm.Parameter.textParam.properties"),
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
