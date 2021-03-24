const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const PostgresStack = require("@grucloud/module-k8s-postgres");

// TODO use PostgresStack.hook

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({
    configs: [config, PostgresStack.config],
  });

  const namespace = await provider.makeNamespace({
    name: "test-postgres",
  });

  const persistentVolume = await provider.makePersistentVolume({
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

  return {
    provider,
    resources: { namespace, persistentVolume, postgres: resourcesPostgres },
  };
};
