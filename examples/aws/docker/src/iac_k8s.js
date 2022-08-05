const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      { provider: await createProvider(K8sProvider, { config: () => ({}) }) },
    ],
  };
};
