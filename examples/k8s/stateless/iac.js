const { K8sProvider } = require("@grucloud/core");

const configMapContent = ({}) => ({ data: { myKey: "myValue" } });

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
            env: [
              {
                name: "MY_VAR",
                valueFrom: {
                  configMapKeyRef: {
                    name: configMap.resource.name,
                    key: "myKey",
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
                name: "MY_VAR",
                valueFrom: {
                  configMapKeyRef: {
                    name: configMap.resource.name,
                    key: "myKey",
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

  const namespace = await provider.makeNamespace({
    name: namespaceName,
  });

  const configMap = await provider.makeConfigMap({
    name: "config-map",
    dependencies: { namespace },
    properties: () => configMapContent({}),
  });

  const storageClass = await provider.makeStorageClass({
    name: storageClassName,
    properties: () => ({
      provisioner: "kubernetes.io/no-provisioner",
      volumeBindingMode: "WaitForFirstConsumer",
    }),
  });

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
    dependencies: { namespace, configMap, persistentVolumeClaim },
    properties: ({ dependencies: { configMap } }) =>
      deploymentRestServerContent({
        label: restServer.label,
        configMap,
        image: restServer.container.image,
        version: restServer.container.version,
        port: restServer.port,
      }),
  });

  return {
    provider,
    resources: {
      namespace,
      ingress,
      configMap,
      storageClass,
      persistentVolumeClaim,
      deploymentUi,
      deploymentRestServer,
    },
  };
};
