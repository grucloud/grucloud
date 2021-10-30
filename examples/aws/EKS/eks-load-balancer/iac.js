const { AwsProvider } = require("@grucloud/provider-aws");
const { createResources } = require("./resources");
exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    createResources,
    configs: [require("./config")],
  });

  return {
    provider,
  };
};
