const { K8sProvider } = require("@grucloud/provider-k8s");
const Dashboard = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, { config: () => ({}) });
  const dashboardResources = await Dashboard.createResources({ provider });
  return { provider, resources: { dashboard: dashboardResources } };
};
