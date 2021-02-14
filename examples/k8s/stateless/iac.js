const { K8sProvider } = require("@grucloud/core");

const configMapContent = ({}) => ({ data: { myKey: "myValue" } });

const deploymentNginx = ({ labelApp, configMap, version = "1.14.2" }) => ({
  metadata: {
    labels: {
      app: labelApp,
    },
  },
  spec: {
    replicas: 2,
    selector: {
      matchLabels: {
        app: labelApp,
      },
    },
    template: {
      metadata: {
        labels: {
          app: labelApp,
        },
      },
      spec: {
        containers: [
          {
            name: "nginx",
            image: `nginx:${version}`,
            ports: [
              {
                containerPort: 80,
              },
            ],
            env: [
              {
                name: "MY_VAR",
                valueFrom: {
                  configMapKeyRef: {
                    name: configMap.resource.name,
                    key: "my-key",
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

  const storageClassName = "my-storage-class";
  const namespaceName = "stateless";
  const deploymentName = "nginx-deployment";
  const labelApp = "app";

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

  const serviceWeb = await provider.makeService({
    name: "web-service",
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: labelApp,
        },
        ports: [
          {
            protocol: "TCP",
            port: 80,
            targetPort: 80,
          },
        ],
      },
    }),
  });

  const deployment = await provider.makeDeployment({
    name: deploymentName,
    dependencies: { namespace, configMap, persistentVolumeClaim },
    properties: ({ dependencies: { configMap } }) =>
      deploymentNginx({ labelApp, configMap }),
  });

  return {
    provider,
    resources: {
      namespace,
      configMap,
      storageClass,
      persistentVolumeClaim,
      deployment,
    },
  };
};
