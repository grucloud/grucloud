const { K8sProvider } = require("@grucloud/provider-k8s");

const Prometheus = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, {
    configs: [Prometheus.config],
    manifests: await Prometheus.loadManifest(),
  });

  const namespace = provider.makeNamespace({
    name: "pgo",
  });

  const resources = await Prometheus.createResources({ provider });
  return {
    provider,
    resources: { namespace, ...resources },
  };
};
