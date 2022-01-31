const { K8sProvider } = require("@grucloud/provider-k8s");

const Prometheus = require("../iac");

const createResources = async ({ provider }) => {
  provider.makeNamespace({
    properties: () => ({
      metadata: {
        name: "pgo",
      },
    }),
  });

  await Prometheus.createResources({ provider });
};
exports.createStack = async ({ createProvider }) => {
  const provider = await createProvider(K8sProvider, {
    configs: [Prometheus.config],
    createResources,
    manifests: await Prometheus.loadManifest(),
  });

  return {
    provider,
  };
};
