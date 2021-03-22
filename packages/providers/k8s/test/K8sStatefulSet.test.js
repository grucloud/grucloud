const assert = require("assert");
const { K8sProvider } = require("../K8sProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");

describe.skip("K8sStatefulSet", async function () {
  let config;
  let provider;
  let namespace;
  let persistentVolume;
  const myNamespace = "test-statefulset";
  const pv = { name: "pv-db" };

  const postgres = {
    statefulSetName: "postgres-statefulset",
    label: "db",
  };

  const types = [
    "StatefulSet",
    "StorageClass",
    "PersistentVolume",
    "PersistentVolumeClaim",
  ];

  before(async function () {
    provider = K8sProvider({
      config: config.k8s,
    });

    await provider.start();
    namespace = await provider.makeNamespace({
      name: myNamespace,
    });

    persistentVolume = await provider.makePersistentVolume({
      name: pv.name,
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

    const statefulPostgresContent = ({ label, pvName }) => ({
      metadata: {
        labels: {
          app: label,
        },
      },
      spec: {
        serviceName: "postgres",
        replicas: 1,
        selector: {
          matchLabels: {
            app: label,
          },
        },
        template: {
          metadata: {
            labels: {
              app: label,
            },
          },
          spec: {
            containers: [
              {
                name: "postgres",
                image: "postgres:10-alpine",
                ports: [
                  {
                    containerPort: 5432,
                    name: "postgres",
                  },
                ],
                volumeMounts: [
                  {
                    name: pvName,
                    mountPath: "/var/lib/postgresql",
                  },
                ],
              },
            ],
          },
        },
        volumeClaimTemplates: [
          {
            metadata: {
              name: pvName,
            },
            spec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "1Gi",
                },
              },
            },
          },
        ],
      },
    });

    statefulSetPostgres = await provider.makeStatefulSet({
      name: postgres.statefulSetName,
      dependencies: { namespace, persistentVolume },
      properties: ({ dependencies: {} }) =>
        statefulPostgresContent({
          label: postgres.label,
          pvName: pv.name,
        }),
    });
  });
  after(async () => {});

  it("k8s statefulset apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    await testPlanDestroy({ provider, types });
  });
});
