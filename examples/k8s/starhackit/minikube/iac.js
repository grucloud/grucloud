const { K8sProvider } = require("@grucloud/provider-k8s");
const assert = require("assert");
const K8sStackBase = require("../base/k8sStackBase");
const { createIngress } = require("./ingress");

exports.createStack = async ({ config }) => {
  assert(config);
  const provider = K8sProvider({
    config,
  });

  const resources = await K8sStackBase.createResources({ provider });

  const ingress = await createIngress({
    provider,
    config: config(),
    resources: {
      namespace: resources.namespace,
      serviceWebServer: resources.webServerChart.service,
      serviceRestServer: resources.restServerChart.service,
    },
  });

  return {
    provider,
    resources: { ...resources, ingress },
    hooks: K8sStackBase.hooks,
  };
};
