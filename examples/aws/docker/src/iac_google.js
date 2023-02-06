exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-google").GoogleProvider,
  createResources: () => [],
  config: () => ({ region: process.env.GCP_REGION }),
});
