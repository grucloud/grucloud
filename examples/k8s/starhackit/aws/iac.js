const assert = require("assert");
const { createStack: createStackK8s } = require("../iac");
const { createStack: createStackEks } = require("../../../aws/eks/iac");
const { createIngress } = require("./eksIngress");

exports.createStack = async ({ config }) => {
  const eksStack = await createStackEks({ config });
  const k8sStack = await createStackK8s({
    config,
    resources: eksStack.resources,
    dependencies: { eks: eksStack.provider },
  });

  const ingress = await createIngress({
    provider: k8sStack.provider,
    config,
    resources: {
      namespace: k8sStack.resources.namespace,
      serviceWebServer: k8sStack.resources.webServerChart.service,
      serviceRestServer: k8sStack.resources.restServerChart.service,
    },
  });

  return [eksStack, k8sStack];
};
