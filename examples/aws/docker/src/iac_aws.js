const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({ config }) => {
  return {
    stacks: [
      {
        provider: AwsProvider({
          config: () => ({ region: process.env.AWS_REGION }),
        }),
      },
    ],
  };
};
