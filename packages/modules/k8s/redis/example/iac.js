const { K8sProvider } = require("@grucloud/provider-k8s");
const RedisStack = require("@grucloud/module-k8s-redis");

const { createResources } = require("./resources");

exports.createStack = ({ createProvider }) => ({
  provider: createProvider(K8sProvider, {
    createResources,
    configs: [RedisStack.config, require("./config")],
  }),
  //hooks: [require("./hook")],
});
