const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  const { config } = provider;

  provider.dynamoDB.makeTable({
    name: config.dynamoDB.Table.myModelTypeDemoTable.name,
    properties: () => config.dynamoDB.Table.myModelTypeDemoTable.properties,
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
