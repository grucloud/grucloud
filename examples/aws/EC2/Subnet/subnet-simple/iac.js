exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-aws").AwsProvider,
  createResources: require("./resources").createResources,
  config: require("./config"),
});
