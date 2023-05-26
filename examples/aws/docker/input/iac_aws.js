exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-aws").AwsProvider,
  createResources: () => [],
  config: () => ({ region: process.env.AWS_REGION, includeAllResources: true }),
});
