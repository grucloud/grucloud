const assert = require("assert");
const { createChartWebServer } = require("./charts/web-server");
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

  const restServerChart = await createChartRestServer({
    provider,
    resources: {
      namespace,
      postgresService: postgresResources.service,
      redisService: redisResources.service,
    },
    config,
  });

  const webServerChart = await createChartWebServer({
    provider,
    resources: { namespace },
    config,
  });

  const dashboardResources = await Dashboard.createResources({ provider });

  return {
    namespace,
    postgresResources,
    redisResources,
    restServerChart,
    webServerChart,
    dashboardResources,
  };
};

exports.createResources = createResources;
