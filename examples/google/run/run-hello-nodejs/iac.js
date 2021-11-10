const { GoogleProvider } = require("@grucloud/provider-google");

const { createResources } = require("./resources");

exports.createStack = ({ createProvider }) => {
  return {
    provider: createProvider(GoogleProvider, {
      createResources,
      config: require("./config"),
    }),
    hooks: [require("./hook")],
  };
};
