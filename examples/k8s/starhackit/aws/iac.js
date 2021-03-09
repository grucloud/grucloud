const assert = require("assert");
const { createStack: createStackK8s } = require("../base/k8sStackBase");
const { createStack: createStackEks } = require("../../../aws/eks/iac");
const { createIngress } = require("./eksIngress");
const { createClusterRole } = require("./clusterRole");

exports.createStack = async ({ config }) => {
  const eksStack = await createStackEks({ config });
  const k8sStack = await createStackK8s({
    config,
    resources: eksStack.resources,
    dependencies: { eks: eksStack.provider },
  });

  const albClusterRole = await createClusterRole({
    provider: k8sStack.provider,
    config,
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
