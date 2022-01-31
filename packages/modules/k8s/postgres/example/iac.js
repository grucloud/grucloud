const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const PostgresStack = require("@grucloud/module-k8s-postgres");

// TODO use PostgresStack.hook
const createResources = async ({ provider }) => {
  const namespace = provider.makeNamespace({
    properties: ({}) => ({
      metadata: {
        name: "test-postgres",
      },
    }),
  });

  provider.makePersistentVolume({
    properties: () => ({
      metadata: {
        name: provider.config.postgres.pvName,
        //namespace: namespace.name,
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

  await PostgresStack.createResources({
    provider,
    resources: { namespace },
  });
};

exports.createStack = async ({ createProvider }) => {
  const provider = await createProvider(K8sProvider, {
    createResources,
    configs: [require("./config"), PostgresStack.config],
  });

  return {
    provider,
  };
};
