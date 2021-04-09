const assert = require("assert");
const { createResourcesWebServer } = require("./charts/web-server");
const { createChartRestServer } = require("./charts/rest-server");
const PostgresStack = require("@grucloud/module-k8s-postgres");
const RedisStack = require("@grucloud/module-k8s-redis");
const Dashboard = require("@grucloud/module-k8s-web-ui-dashboard");

exports.hooks = require("./hooks");

exports.configs = [PostgresStack.config, RedisStack.config];

const createResources = async ({ provider }) => {
  const { config } = provider;
  assert(config.namespaceName);

  const namespace = await provider.makeNamespace({
    name: config.namespaceName,
  });

  const postgresResources = await PostgresStack.createResources({
    provider,
    resources: { namespace },
  });

  const redisResources = await RedisStack.createResources({
    provider,
    resources: { namespace },
    config,
  });

  const restServerResources = await createChartRestServer({
    provider,
    resources: {
      namespace,
      postgresService: postgresResources.service,
      redisService: redisResources.service,
    },
    config,
  });

  const webServerResources = await createResourcesWebServer({
    provider,
    resources: { namespace },
    config,
  });

  const dashboardResources =
    config.dashboard && (await Dashboard.createResources({ provider }));

  return {
    namespace,
    postgresResources,
    redisResources,
    restServerResources,
    webServerResources,
    dashboardResources,
  };
};

exports.createResources = createResources;
