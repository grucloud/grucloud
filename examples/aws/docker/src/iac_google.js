const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: createProvider(GoogleProvider, {
          configs: [() => ({ region: process.env.GCP_REGION })],
        }),
      },
    ],
  };
};
