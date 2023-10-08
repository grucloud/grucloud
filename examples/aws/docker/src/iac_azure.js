exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-azure").AzureProvider,
  createResources: () => [],
  config: () => ({ location: process.env.AZURE_LOCATION }),
});
