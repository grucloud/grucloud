const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const PostgresStack = require("@grucloud/module-k8s-postgres");

// TODO use PostgresStack.hook
const createResources = async ({ provider }) => {
  const namespace = provider.makeNamespace({
    name: "test-postgres",
  });

  const persistentVolume = provider.makePersistentVolume({
    name: provider.config.postgres.pvName,
    dependencies: { namespace },
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

  const resourcesPostgres = await PostgresStack.createResources({
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
