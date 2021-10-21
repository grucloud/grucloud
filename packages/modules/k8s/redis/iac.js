const assert = require("assert");

exports.hooks = [require("./hook")];

const config = require("./config");
exports.config = config;

const createResources = ({ provider, resources: { namespace } }) => {
  assert(namespace, "This redis module requires a namespace");

  const { redis } = provider.config;

  assert(redis);
  assert(redis.label);
  assert(redis.serviceName);
  assert(redis.statefulSetName);
  assert(redis.image);
  assert(redis.port);

  const statefulSet = provider.makeStatefulSet({
    name: redis.statefulSetName,
    dependencies: { namespace },
    properties: ({}) => ({
      metadata: {
        labels: {
          app: redis.label,
        },
      },
      spec: {
        serviceName: redis.serviceName,
        replicas: 1,
        selector: {
          matchLabels: {
            app: redis.label,
          },
        },
        template: {
          metadata: {
            labels: {
              app: redis.label,
            },
          },
          spec: {
            containers: [
              {
                name: "redis",
                image: redis.image,
                ports: [
                  {
                    containerPort: redis.port,
                    name: "redis",
                  },
                ],
                readinessProbe: {
                  exec: {
                    command: ["redis-cli", "ping"],
                  },
                  initialDelaySeconds: 4,
                  timeoutSeconds: 2,
                },
                livenessProbe: {
                  exec: {
                    command: ["redis-cli", "ping"],
                  },
                  initialDelaySeconds: 45,
                  timeoutSeconds: 2,
                },
              },
            ],
          },
        },
      },
    }),
  });

  const service = provider.makeService({
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
exports.createResources = createResources;
