const { assign } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");
const { createResources } = require("./resources");

exports.createStack = assign({
  provider: ({ createProvider }) =>
    createProvider(AwsProvider, {
      createResources,
      config: require("./config"),
    }),
});
