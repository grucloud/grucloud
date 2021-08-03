const { K8sProvider } = require("@grucloud/provider-k8s");
const ModuleCertManager = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, {
    configs: [require("./config"), ModuleCertManager.config],
    manifests: [...(await ModuleCertManager.loadManifest())],
  });

  const namespace = provider.makeNamespace({
    name: "example",
  });

  const resources = await ModuleCertManager.createResources({ provider });
  return { provider, resources: { namespace, ...resources } };
};
