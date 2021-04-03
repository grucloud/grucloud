const { K8sProvider } = require("@grucloud/provider-k8s");
const { createResources } = require("../resources");

exports.createStack = async () => {
  const provider = K8sProvider({});
  const resources = await createResources({ provider });
  return { provider, resources };
};
