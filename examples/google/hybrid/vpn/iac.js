const { assign } = require("rubico");
const { GoogleProvider } = require("@grucloud/provider-google");
const { createResources } = require("./resources");

exports.createStack = assign({
  provider: ({ createProvider }) =>
    createProvider(GoogleProvider, {
      createResources,
      config: require("./config"),
    }),
});
