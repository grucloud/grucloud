const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const RedisStack = require("@grucloud/module-k8s-redis");

// TODO use RedisStack.hook

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, {
    configs: [RedisStack.config],
  });

  const namespace = provider.makeNamespace({
    name: "test-redis",
  });

  const resourcesRedis = await RedisStack.createResources({
    provider,
    resources: { namespace },
  });

  return {
    provider,
    resources: { namespace, redis: resourcesRedis },
  };
};
