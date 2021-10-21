const { AwsProvider } = require("@grucloud/provider-aws");

const { createResources } = require("./resources");

exports.createStack = async ({ createProvider }) => ({
  provider: await createProvider(AwsProvider, {
    createResources,
    config: require("./config"),
  }),
  hooks: [require("./hook")],
});
