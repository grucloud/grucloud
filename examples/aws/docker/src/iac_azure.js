const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: await createProvider(AzureProvider, {
          config: () => ({
            location: process.env.LOCATION,
          }),
        }),
      },
    ],
  };
};
