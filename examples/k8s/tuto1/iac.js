const { K8sProvider } = require("@grucloud/provider-k8s");

// Create a namespace, service and deployment
const createResource = async ({ provider }) => {
  const { config } = provider;

  const namespace = provider.makeNamespace({
    name: config.namespace,
  });

  const mySecret = provider.makeSecret({
    name: "my-secret",
    properties: () => ({
      type: "Opaque",
      data: { dbUrl: Buffer.from(process.env.DB_URL).toString("base64") },
    }),
  });

  const service = provider.makeService({
    name: config.service.name,
    dependencies: { namespace },
    properties: () => ({
      spec: {
        selector: {
          app: config.appLabel,
        },
        type: "NodePort",
        ports: [
          {
            protocol: "TCP",
            port: 80,
            targetPort: 80,
            nodePort: 30020,
          },
        ],
      },
    }),
  });

  const deployment = provider.makeDeployment({
    name: config.deployment.name,
    dependencies: { namespace },
    properties: ({}) => ({
      metadata: {
        labels: {
          app: config.appLabel,
        },
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: config.appLabel,
          },
        },
        template: {
          metadata: {
            labels: {
              app: config.appLabel,
            },
          },
          spec: {
            containers: [
              {
                name: config.deployment.container.name,
                image: config.deployment.container.image,
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
    }),
  });

  return { namespace, service, deployment };
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, { config: require("./config") });
  const resources = await createResource({ provider });
  return { provider, resources, hooks: [require("./hook")] };
};
