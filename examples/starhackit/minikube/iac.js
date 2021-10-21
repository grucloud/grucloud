const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const K8sStackBase = require("../base/k8sStackBase");
const hooks = [require("./hook")];
const { createResources } = require("./resources");

exports.createStack = async ({ createProvider }) => {
  const provider = await createProvider(K8sProvider, {
    createResources,
    configs: [require("./config"), ...K8sStackBase.configs],
  });

  return {
    provider,
    hooks: [...K8sStackBase.hooks, ...hooks],
  };
};
