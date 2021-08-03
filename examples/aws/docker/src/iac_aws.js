const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      {
        provider: createProvider(AwsProvider, {
          config: () => ({ region: process.env.AWS_REGION }),
        }),
      },
    ],
  };
};
