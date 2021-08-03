const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: createProvider(AzureProvider, {
          config: () => ({
            location: process.env.LOCATION,
          }),
        }),
      },
    ],
  };
};
