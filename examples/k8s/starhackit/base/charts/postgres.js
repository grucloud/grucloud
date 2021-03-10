const assert = require("assert");

exports.createChartPostgres = async ({
  provider,
  resources: { namespace },
  config,
}) => {
  const { postgres, pv } = config;

  assert(postgres);
  assert(postgres.env);
  assert(postgres.serviceName);
  assert(postgres.label);
  assert(postgres.port);

  assert(pv.name);

  assert(namespace);

  const configMapName = "postgres";
  const configMap = await provider.makeConfigMap({
    name: configMapName,
    dependencies: { namespace },
    properties: () => ({
      data: postgres.env,
    }),
  });

  const persistentVolume = await provider.makePersistentVolume({
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
              env: [
                {
                  name: "POSTGRES_USER",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMapName,
                      key: "POSTGRES_USER",
                    },
                  },
                },

                {
                  name: "POSTGRES_PASSWORD",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMapName,
                      key: "POSTGRES_PASSWORD",
                    },
                  },
                },
                {
                  name: "POSTGRES_DB",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMapName,
                      key: "POSTGRES_DB",
                    },
                  },
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

  const statefulSet = await provider.makeStatefulSet({
    name: postgres.statefulSetName,
    dependencies: { namespace, configMap, persistentVolume },
    properties: ({ dependencies }) =>
      statefulPostgresContent({
        label: postgres.label,
        pvName: pv.name,
      }),
  });

  const service = await provider.makeService({
    name: postgres.serviceName,
    dependencies: { namespace, statefulSet },
    properties: () => ({
      spec: {
        selector: {
          app: postgres.label,
        },
        clusterIP: "None", // Headless service
        ports: [
          {
            protocol: "TCP",
            port: postgres.port,
            targetPort: postgres.port,
          },
        ],
      },
    }),
  });

  return {
    service,
    configMap,
    statefulSet,
  };
};
