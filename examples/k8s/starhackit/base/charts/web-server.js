const assert = require("assert");

exports.createChartWebServer = async ({
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

  const deployment = await provider.makeDeployment({
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

  const service = await provider.makeService({
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
