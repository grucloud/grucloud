const { AzureProvider } = require("@grucloud/provider-azure");
const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: await createProvider(AzureProvider, {
          name: "azure",
          createResources: require("./resources-azure").createResources,
          config: require("./config-azure"),
        }),
      },
      {
        provider: await createProvider(GoogleProvider, {
          name: "google",
          createResources: require("./resources-google").createResources,
          config: require("./config-google"),
        }),
      },
    ],
  };
};
