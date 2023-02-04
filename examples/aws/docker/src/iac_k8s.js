const assert = require("assert");
exports.createStack = () => ({
  providerFactory: require("@grucloud/provider-k8s").K8sProvider,
  createResources: () => [],
  config: () => ({}),
});
