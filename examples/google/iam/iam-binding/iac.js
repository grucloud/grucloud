exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-google").GoogleProvider,
  createResources: require("./resources").createResources,
  config: require("./config"),
});
