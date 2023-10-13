exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-google").GoogleProvider,
  createResources: () => [],
  config: () => ({}),
});
