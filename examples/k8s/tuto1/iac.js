const { K8sProvider } = require("@grucloud/provider-k8s");

const { createResources } = require("./resources");

exports.createStack = ({ createProvider }) => ({
  provider: createProvider(K8sProvider, {
    createResources,
    config: require("./config"),
  }),
  hooks: [require("./hook")],
});
