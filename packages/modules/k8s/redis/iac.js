const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");

const hooks = require("./hooks");
exports.hooks = hooks;

const config = require("./config");
exports.config = config;

const createResources = async ({ provider, resources: { namespace } }) => {
  assert(namespace, "This redis module requires a namespace");

  const { redis } = provider.config;

  assert(redis);
  assert(redis.label);
  assert(redis.serviceName);
  assert(redis.statefulSetName);
  assert(redis.container);
  assert(redis.port);

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
exports.createResources = createResources;
// Only for "gc graph"

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({
    config,
  });

  const namespace = await provider.makeNamespace({
    name: "redis",
  });

  const resources = await createResources({
    provider,
    resources: { namespace },
  });

  return {
    provider,
    resources,
    hooks,
  };
};
