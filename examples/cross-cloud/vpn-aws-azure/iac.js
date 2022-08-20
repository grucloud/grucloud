const { AwsProvider } = require("@grucloud/provider-aws");
const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: await createProvider(AwsProvider, {
          name: "aws",
          createResources: require("./resources-aws").createResources,
          config: require("./config-aws"),
        }),
      },
      {
        provider: await createProvider(AzureProvider, {
          name: "azure",
          createResources: require("./resources-azure").createResources,
          config: require("./config-azure"),
        }),
      },
    ],
  };
};
