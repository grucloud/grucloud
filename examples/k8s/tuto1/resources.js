exports.createResources = ({ provider }) => {
  const { config } = provider;

  provider.makeNamespace({
    properties: ({}) => ({
      metadata: {
        name: config.namespace,
      },
    }),
  });

  provider.makeSecret({
    properties: () => ({
      type: "Opaque",
      data: { dbUrl: Buffer.from(process.env.DB_URL).toString("base64") },
      metadata: { name: "my-secret", namespace: config.namespace },
    }),
  });

  provider.makeService({
    properties: () => ({
      metadata: {
        name: config.service.name,
        namespace: config.namespace,
      },
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

  provider.makeDeployment({
    properties: ({}) => ({
      metadata: {
        name: config.deployment.name,
        namespace: config.namespace,
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
};
