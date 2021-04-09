const assert = require("assert");

exports.createChartRedis = async ({
  provider,
  resources: { namespace },
  config,
}) => {
  const { redis } = config;

  assert(redis);
  assert(redis.serviceName);

  assert(namespace);

  const statefulRedisContent = ({ label, image, version, port }) => ({
    metadata: {
      labels: {
        app: label,
      },
    },
    spec: {
      serviceName: "redis",
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
              name: "redis",
              image: image,
              ports: [
                {
                  containerPort: port,
                  name: "redis",
                },
              ],
            },
          ],
        },
      },
    },
  });

  const statefulSet = await provider.makeStatefulSet({
    name: redis.statefulSetName,
    dependencies: { namespace },
    properties: ({}) =>
      statefulRedisContent({
        label: redis.label,
        image: redis.container.image,
        version: redis.container.version,
        port: redis.port,
      }),
  });

  const service = await provider.makeService({
    name: redis.serviceName,
    dependencies: { namespace, statefulSet },
    properties: () => ({
      spec: {
        selector: {
          app: redis.label,
        },
        clusterIP: "None", // Headless service
        ports: [
          {
            protocol: "TCP",
            port: redis.port,
            targetPort: redis.port,
          },
        ],
      },
    }),
  });

  return {
    service,
    statefulSet,
  };
};
