const assert = require("assert");

exports.createResourcesWebServer = async ({
  provider,
  resources: { namespace },
  config: { ui },
}) => {
  assert(ui);
  assert(ui.serviceName);
  assert(ui.deploymentName);
  assert(ui.port);

  assert(namespace);

  const deploymentUiContent = ({
    label,
    image,
    version = "latest",
    containerPort = "3000",
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
                  containerPort: containerPort,
                },
              ],
            },
          ],
        },
      },
    },
  });

  const deployment = provider.makeDeployment({
    name: ui.deploymentName,
    dependencies: { namespace },
    properties: () =>
      deploymentUiContent({
        label: ui.label,
        image: ui.container.image,
        version: ui.container.version,
        containerPort: ui.containerPort,
      }),
  });

  const service = provider.makeService({
    name: ui.serviceName,
    dependencies: { namespace, deployment },
    properties: () => ({
      spec: {
        selector: {
          app: ui.label,
        },
        type: "NodePort",
        ports: [
          {
            protocol: "TCP",
            port: ui.port,
            targetPort: ui.containerPort,
            nodePort: 30010,
          },
        ],
      },
    }),
  });

  return {
    service,
    deployment,
  };
};
