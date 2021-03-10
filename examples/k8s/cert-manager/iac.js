const { K8sProvider } = require("@grucloud/core");
const { createResources } = require("./resources");
exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ config });
  const resources = await createResources({ provider });
  return { provider, resources };
};
