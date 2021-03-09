const assert = require("assert");
const { createStack: createStackEks } = require("../base/k8sStackBase");
const { createIngress } = require("./ingress");

exports.createStack = async ({ config }) => {
  const stack = await createStackEks({
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
