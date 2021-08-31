// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  const { config } = provider;

  provider.IAM.makePolicy({
    name: config.IAM.Policy.appsyncDsDdbKq4ygeMyModelTypeDemoTable.name,
    properties: () =>
      config.IAM.Policy.appsyncDsDdbKq4ygeMyModelTypeDemoTable.properties,
  });

  provider.IAM.makeRole({
    name: config.IAM.Role.appsyncDsDdbKq4ygeMyModelTypeDemoTable.name,
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy.appsyncDsDdbKq4ygeMyModelTypeDemoTable],
    }),
    properties: () =>
      config.IAM.Role.appsyncDsDdbKq4ygeMyModelTypeDemoTable.properties,
  });

  provider.AppSync.makeGraphqlApi({
    name: config.AppSync.GraphqlApi.myAppSyncApp.name,
    properties: () => config.AppSync.GraphqlApi.myAppSyncApp.properties,
  });

  provider.AppSync.makeApiKey({
    name: config.AppSync.ApiKey.da2Wbuvlxl5cfapbifytstbzthsxy.name,
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.myAppSyncApp,
    }),
    properties: () =>
      config.AppSync.ApiKey.da2Wbuvlxl5cfapbifytstbzthsxy.properties,
  });

  provider.AppSync.makeDataSource({
    name: config.AppSync.DataSource.datasource.name,
    dependencies: ({ resources }) => ({
      graphqlApi: resources.AppSync.GraphqlApi.myAppSyncApp,
    }),
    properties: () => config.AppSync.DataSource.datasource.properties,
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
