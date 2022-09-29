exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-azure").AzureProvider,
  createResources: require("./resources").createResources,
  config: require("./config"),
});
