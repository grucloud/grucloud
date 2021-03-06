const assert = require("assert");
const { K8sProvider } = require("@grucloud/core");
const { createChartWebServer } = require("./charts/web-server");
const { createChartRestServer } = require("./charts/rest-server");
const { createChartPostgres } = require("./charts/postgres");
const { createChartRedis } = require("./charts/redis");
const { createIngress } = require("./ingress");

exports.createStack = async ({ config, resources, dependencies }) => {
  const provider = K8sProvider({ config, dependencies });

  assert(config.namespaceName);

  const serviceAccountName = "service-account-aws";

  const namespace = await provider.makeNamespace({
    name: config.namespaceName,
  });

  const postgresChart = await createChartPostgres({
    provider,
    resources: { namespace },
    config,
  });

  const redisChart = await createChartRedis({
    provider,
    resources: { namespace },
    config,
  });

  const restServerChart = await createChartRestServer({
    provider,
    resources: {
      namespace,
      postgresService: postgresChart.service,
      redisService: redisChart.service,
    },
    config,
  });

  const webServerChart = await createChartWebServer({
    provider,
    resources: { namespace },
    config,
  });

  const ingress = await createIngress({
    provider,
    config,
    resources: {
      namespace,
      serviceWebServer: webServerChart.service,
      serviceRestServer: restServerChart.service,
    },
  });

  const storageClass = await provider.makeStorageClass({
    name: config.storageClassName,
    properties: () => ({
      provisioner: "kubernetes.io/no-provisioner",
      volumeBindingMode: "WaitForFirstConsumer",
    }),
  });

  const serviceAccount = await provider.makeServiceAccount({
    name: serviceAccountName,
    dependencies: { namespace },
    properties: () => ({}),
  });

  return {
    provider,
    resources: {
      ingress,
      namespace,
      serviceAccount,
      storageClass,
    },
  };
};
