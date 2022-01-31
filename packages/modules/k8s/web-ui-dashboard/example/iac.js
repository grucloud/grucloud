const { K8sProvider } = require("@grucloud/provider-k8s");
const Dashboard = require("../iac");

exports.createStack = async ({ createProvider }) => {
  return {
    provider: await createProvider(K8sProvider, {
      createResources: [Dashboard.createResources],
      config: () => ({}),
    }),
  };
};
