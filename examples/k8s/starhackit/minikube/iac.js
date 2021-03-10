const { createStack: createStackK8s } = require("../base/k8sStackBase");
const { createIngress } = require("./ingress");

exports.createStack = async ({ config }) => {
  const stack = await createStackK8s({
    config,
  });
  const { provider, resources } = stack;

  const ingress = await createIngress({
    provider,
    config,
    resources: {
      namespace: resources.namespace,
      serviceWebServer: resources.webServerChart.service,
      serviceRestServer: resources.restServerChart.service,
    },
  });

  return { ...stack, resources: { ...stack.resources, ingress } };
};
