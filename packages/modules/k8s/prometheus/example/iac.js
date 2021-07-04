const { K8sProvider } = require("@grucloud/provider-k8s");

const Prometheus = require("../iac");

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({
    configs: [config, Prometheus.config],
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
