const { K8sProvider } = require("@grucloud/provider-k8s");
exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ config });
  // Define manifest here
  return { provider };
};
