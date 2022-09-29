const { AwsProvider } = require("@grucloud/provider-aws");
const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = () => ({
  stacks: [
    {
      providerFactory: AwsProvider,
      directory: "aws",
      createResources: require("./aws/resources").createResources,
      config: require("./aws/config"),
    },
    {
      providerFactory: AzureProvider,
      directory: "azure",
      createResources: require("./azure/resources").createResources,
      config: require("./azure/config"),
    },
  ],
});
