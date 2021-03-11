const { K8sProvider } = require("@grucloud/core");
const { createResources } = require("./resources");

const CertManager = require("../cert-manager/iac");

exports.createStack = async ({ config }) => {
  const manifests = await CertManager.loadManifest();

  const provider = K8sProvider({
    config,
    manifests,
  });

  const certResources = await CertManager.createResources({ provider });
  const resources = await createResources({ provider });

  return [{ provider, resources: { ...certResources, ...resources } }];
};
