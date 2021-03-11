const { K8sProvider } = require("@grucloud/core");
const { createResources } = require("./resources");

const CertManager = require("../cert-manager/iac");

exports.createStack = async ({ config }) => {
  const certManagerStack = await CertManager.createStack({ config });

  const provider = K8sProvider({
    config,
    manifests: certManagerStack.manifests,
    dependencies: { certManager: certManagerStack.provider },
  });
  const resources = await createResources({ provider });
  return [certManagerStack, { provider, resources }];
};
