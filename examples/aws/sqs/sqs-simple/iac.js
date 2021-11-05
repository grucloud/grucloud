const { AwsProvider } = require("@grucloud/provider-aws");

const { createResources } = require("./resources");

exports.createStack = ({ createProvider }) => ({
  provider: createProvider(AwsProvider, {
    createResources,
    config: require("./config"),
  }),
  hooks: [require("./hook")],
});
