const { K8sProvider } = require("@grucloud/core");

const deploymentNginx = ({ labelApp, version = "1.14.2" }) => ({
  metadata: {
    labels: {
      app: labelApp,
    },
  },
  spec: {
    replicas: 3,
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
          },
        ],
      },
    },
  },
});

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ config });

  const namespaceName = "test";
  const deploymentName = "app-deployment";
  const labelApp = "app";

  const namespace = await provider.makeNamespace({
    name: namespaceName,
  });

  const deployment = await provider.makeDeployment({
    name: deploymentName,
    dependencies: { namespace },
    properties: () => deploymentNginx({ labelApp }),
  });

  return {
    provider,
    resources: {
      //
      namespace,
      deployment,
    },
  };
};
