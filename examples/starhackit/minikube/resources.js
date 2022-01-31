const assert = require("assert");
const K8sStackBase = require("../base/k8sStackBase");
const { createIngress } = require("./ingress");

exports.createResources = async ({ provider }) => {
  const resources = await K8sStackBase.createResources({ provider });

  assert(provider.config.postgres.pvName);

  provider.makePersistentVolume({
    properties: () => ({
      metadata: {
        name: provider.config.postgres.pvName,
      },
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
    config: provider.getConfig(),
    resources: {
      namespace: resources.namespace,
      serviceWebServer: resources.webServerResources.service,
      serviceRestServer: resources.restServerResources.service,
    },
  });
};
