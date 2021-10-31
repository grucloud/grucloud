const { K8sProvider } = require("@grucloud/provider-k8s");
const BaseStack = require("../base/k8sStackBase");

const createK8sStack = async ({ createProvider }) => {
  const provider = await createProvider(K8sProvider, {
    createResources: BaseStack.createResources,
    configs: [require("./configK8s"), ...BaseStack.configs],
  });

  return {
    provider,
    hooks: [...BaseStack.hooks],
  };
};

exports.createStack = async ({ createProvider }) => {
  const stackK8s = await createK8sStack({ createProvider });

  return {
    hookGlobal: require("./hookGlobal"),
    stacks: [stackK8s],
  };
};
