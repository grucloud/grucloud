const { assign } = require("rubico");
const { AzureProvider } = require("@grucloud/provider-azure");
const { createResources } = require("./resources");

exports.createStack = assign({
  provider: ({ createProvider }) =>
    createProvider(AzureProvider, {
      createResources,
      config: require("./config"),
    }),
});
