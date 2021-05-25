const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async ({ config }) => {
  return {
    stacks: [
      {
        provider: GoogleProvider({
          configs: [config, () => ({ region: process.env.GCP_REGION })],
        }),
      },
    ],
  };
};
