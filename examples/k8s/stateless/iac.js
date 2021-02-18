const { K8sProvider } = require("@grucloud/core");

const deploymentUiContent = ({
  label,
  configMap,
  image = "ngnix",
  version = "latest",
  port = "80",
}) => ({
  metadata: {
    labels: {
      app: label,
    },
  },
  spec: {
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
            name: "ui",
            image: `${image}:${version}`,
            ports: [
              {
                containerPort: port,
              },
            ],
          },
        ],
      },
    },
  },
});

const deploymentRestServerContent = ({
  label = "rest-server",
  configMap,
  image,
  version = "latest",
  port = "3000",
}) => ({
  metadata: {
    labels: {
      app: label,
    },
  },
  spec: {
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
            name: "rest-server",
            image: `${image}:${version}`,
            ports: [
              {
                containerPort: port,
              },
            ],
            command: ["/bin/sh"],
            args: ["scripts/initialise.sh"],
            env: [
              {
                name: "NODE_CONFIG",
                valueFrom: {
                  configMapKeyRef: {
                    name: configMap.resource.name,
                    key: "NODE_CONFIG",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
});

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ config });
  const namespaceName = "stateless";
  const storageClassName = "my-storage-class";

  const ui = {
    container: { image: "fredericheem/ui", version: "latest" },
    serviceName: "web-service",
    deploymentName: "web-deployment",
    label: "ui",
    port: 80,
  };

  const restServer = {
    container: { image: "fredericheem/api", version: "latest" },
    serviceName: "rest-service",
    deploymentName: "rest-deployment",
    label: "rest",
    port: 3000,
  };

  const pv = { name: "pv-db" };

  const postgres = {
    statefulSetName: "postgres-statefulset",
    serviceName: "postgres-service",
    label: "db",
    port: 5432,
    env: {
      POSTGRES_USER: "dbuser",
      POSTGRES_PASSWORD: "peggy went to the market",
      POSTGRES_DB: "main",
    },
  };
  const buildPostgresUrl = ({
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    host,
    port = "5432",
  }) =>
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${host}:${port}/${POSTGRES_DB}?sslmode=disable`;

  const namespace = await provider.makeNamespace({
    name: namespaceName,
  });

  const configMap = await provider.makeConfigMap({
    name: "config-map",
    dependencies: { namespace },
    properties: () => ({
      data: {
        POSTGRES_USER: "dbuser",
        POSTGRES_PASSWORD: "peggy went to the market",
        POSTGRES_DB: "main",
      },
    }),
  });

  const storageClass = await provider.makeStorageClass({
    name: storageClassName,
    properties: () => ({
      provisioner: "kubernetes.io/no-provisioner",
      volumeBindingMode: "WaitForFirstConsumer",
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
  /*
  const persistentVolumeClaim = await provider.makePersistentVolumeClaim({
    name: "persistent-volume-claim",
    dependencies: { namespace, storageClass },
    properties: () => ({
      spec: {
        accessModes: ["ReadWriteOnce"],
        storageClassName: storageClassName,
        resources: {
          requests: {
            storage: "1Gi",
          },
        },
      },
    }),
  });
*/
  const serviceUi = await provider.makeService({
    name: ui.serviceName,
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: ui.label,
        },
        ports: [
          {
            protocol: "TCP",
            port: ui.port,
            targetPort: ui.port,
          },
        ],
      },
    }),
  });

  const configMapRestServer = await provider.makeConfigMap({
    name: "rest-server-config-map",
    dependencies: { namespace },
    properties: () => ({
      data: {
        NODE_CONFIG: JSON.stringify({
          db: {
            url: buildPostgresUrl({
              ...postgres.env,
              host: `${postgres.serviceName}-0`,
            }),
          },
          /*redis: {
            url: "redis://redis:6379",
          },*/
        }),
      },
    }),
  });

  const serviceRestServer = await provider.makeService({
    name: restServer.serviceName,
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: restServer.label,
        },
        ports: [
          {
            protocol: "TCP",
            port: restServer.port,
            targetPort: restServer.port,
          },
        ],
      },
    }),
  });

  const ingress = await provider.makeIngress({
    name: "ingress",
    dependencies: { namespace, serviceUi, serviceRestServer },
    properties: () => ({
      spec: {
        rules: [
          {
            http: {
              paths: [
                {
                  path: "/",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: ui.serviceName,
                      port: {
                        number: ui.port,
                      },
                    },
                  },
                },
                {
                  path: "/api",
                  pathType: "Prefix",
                  backend: {
                    service: {
                      name: restServer.serviceName,
                      port: {
                        number: restServer.port,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  });

  const deploymentUi = await provider.makeDeployment({
    name: ui.deploymentName,
    dependencies: { namespace, configMap },
    properties: ({ dependencies: { configMap } }) =>
      deploymentUiContent({
        label: ui.label,
        configMap,
        image: ui.container.image,
        version: ui.container.version,
        port: ui.port,
      }),
  });

  const deploymentRestServer = await provider.makeDeployment({
    name: restServer.deploymentName,
    dependencies: {
      namespace,
      configMap: configMapRestServer,
      persistentVolume,
    },
    properties: ({ dependencies: { configMap } }) =>
      deploymentRestServerContent({
        label: restServer.label,
        configMap,
        image: restServer.container.image,
        version: restServer.container.version,
        port: restServer.port,
      }),
  });

  const configMapPostgres = await provider.makeConfigMap({
    name: "postgres-config-map",
    dependencies: { namespace },
    properties: () => ({
      data: postgres.env,
    }),
  });

  const servicePostgres = await provider.makeService({
    name: postgres.serviceName,
    dependencies: { namespace },
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

  const statefulPostgresContent = ({ configMap, name, label, pvName }) => ({
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
                      name: configMap.resource.name,
                      key: "POSTGRES_USER",
                    },
                  },
                },

                {
                  name: "POSTGRES_PASSWORD",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMap.resource.name,
                      key: "POSTGRES_PASSWORD",
                    },
                  },
                },
                {
                  name: "POSTGRES_DB",
                  valueFrom: {
                    configMapKeyRef: {
                      name: configMap.resource.name,
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

  const statefulSetPostgres = await provider.makeStatefulSet({
    name: postgres.statefulSetName,
    dependencies: { namespace, configMap: configMapPostgres, persistentVolume },
    properties: ({ dependencies: { configMap } }) =>
      statefulPostgresContent({
        label: postgres.label,
        configMap,
        pvName: pv.name,
      }),
  });

  return {
    provider,
    resources: {
      namespace,
      ingress,
      configMap,
      storageClass,
      persistentVolume,
      //persistentVolumeClaim,
      deploymentUi,
      deploymentRestServer,
    },
  };
};
