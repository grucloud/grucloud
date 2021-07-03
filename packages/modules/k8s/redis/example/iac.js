const assert = require("assert");
const { K8sProvider } = require("@grucloud/provider-k8s");
const RedisStack = require("@grucloud/module-k8s-redis");

// TODO use RedisStack.hook

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({
    configs: [config, RedisStack.config],
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
