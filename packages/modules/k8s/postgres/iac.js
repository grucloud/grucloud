const assert = require("assert");

exports.hooks = [require("./hook")];

const config = require("./config");
exports.config = config;

const createResources = ({ provider, resources: { namespace } }) => {
  assert(namespace, "This postgres module requires a namespace");

  const { postgres } = provider.config;

  assert(postgres);
  assert(postgres.env);
  assert(postgres.serviceName);
  assert(postgres.label);
  assert(postgres.port);
  assert(postgres.pvName);

  const configMapName = "postgres";
  provider.makeConfigMap({
    properties: () => ({
      metadata: { name: configMapName, namespace: namespace.name },
      data: postgres.env,
    }),
  });

  provider.makeStatefulSet({
    properties: () => ({
      metadata: {
        name: postgres.statefulSetName,
        namespace: namespace.name,
        labels: {
          app: postgres.label,
        },
      },
      spec: {
        serviceName: postgres.serviceName,
        replicas: 1,
        selector: {
          matchLabels: {
            app: postgres.label,
          },
        },
        template: {
          metadata: {
            labels: {
              app: postgres.label,
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
                    name: postgres.pvName,
                    mountPath: "/var/lib/postgresql",
                  },
                ],
                readinessProbe: {
                  exec: {
                    command: [
                      "psql",
                      "-U",
                      postgres.env.POSTGRES_USER,
                      "-d",
                      postgres.env.POSTGRES_DB,
                      "-c",
                      "SELECT 1",
                    ],
                  },
                  initialDelaySeconds: 4,
                  timeoutSeconds: 2,
                },
                livenessProbe: {
                  exec: {
                    command: [
                      "psql",
                      "-U",
                      postgres.env.POSTGRES_USER,
                      "-d",
                      postgres.env.POSTGRES_DB,
                      "-c",
                      "SELECT 1",
                    ],
                  },
                  initialDelaySeconds: 45,
                  timeoutSeconds: 2,
                },
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
                    name: "PGPASSWORD",
                    valueFrom: {
                      configMapKeyRef: {
                        name: configMapName,
                        key: "POSTGRES_PASSWORD",
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
              name: postgres.pvName,
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
    }),
  });

  provider.makeService({
    properties: () => ({
      metadata: { name: postgres.serviceName, namespace: namespace.name },
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
};
exports.createResources = createResources;
