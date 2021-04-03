const { K8sProvider } = require("@grucloud/provider-k8s");
const Dashboard = require("../resources");

exports.createStack = async () => {
  const provider = K8sProvider({});
  const dashboardResources = await Dashboard.createResources({ provider });
  return { provider, resources: { dashboard: dashboardResources } };
};
