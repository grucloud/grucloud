const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = async ({ config }) => {
  return {
    stacks: [
      {
        provider: AzureProvider({
          config: () => ({
            location: process.env.LOCATION,
          }),
        }),
      },
    ],
  };
};
