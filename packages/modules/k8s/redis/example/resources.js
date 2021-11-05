const RedisStack = require("@grucloud/module-k8s-redis");

// TODO use RedisStack.hook

exports.createResources = ({ provider }) => {
  const namespace = provider.makeNamespace({
    name: "test-redis",
  });

  const resourcesRedis = RedisStack.createResources({
    provider,
    resources: { namespace },
  });
};
