const { GoogleProvider } = require("@grucloud/provider-google");

const { createResources } = require("./resources");

exports.createStack = ({ createProvider }) => ({
  provider: createProvider(GoogleProvider, {
    createResources,
    config: require("./config"),
  }),
  hooks: [require("./hook")],
});
