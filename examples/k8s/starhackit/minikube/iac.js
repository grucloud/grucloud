const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const K8sStackBase = require("../base/k8sStackBase");
const { createIngress } = require("./ingress");

exports.createStack = async ({ config }) => {
  assert(config);
  const provider = K8sProvider({
    configs: [config, ...K8sStackBase.configs],
  });

  const resources = await K8sStackBase.createResources({ provider });

  assert(provider.config.postgres.pvName);

  const persistentVolume = await provider.makePersistentVolume({
    name: provider.config.postgres.pvName,
    dependencies: { namespace: resources.namespace },
    properties: () => ({
      spec: {
        accessModes: ["ReadWriteOnce"],
        capacity: {
          storage: "2Gi",
        },
        hostPath: {
          path: "/data/pv0001/",
        },
      },
    }),
  });

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
