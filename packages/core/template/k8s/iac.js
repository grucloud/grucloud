const { assign } = require("rubico");
const { K8sProvider } = require("@grucloud/provider-k8s");
const { createResources } = require("./resources");

exports.createStack = assign({
  provider: ({ createProvider }) =>
    createProvider(K8sProvider, {
      createResources,
      config: require("./config"),
    }),
});
