const assert = require("assert");
const { K8sProvider } = require("@grucloud/core");
const BaseStack = require("../base/k8sStackBase");
const AwsLoadBalancerStack = require("../../aws-load-balancer/iac");

const EKSStack = require("../../../aws/eks/iac");
const { createIngress } = require("./eksIngress");
const { createClusterRole } = require("./clusterRole");

exports.createStack = async ({ config }) => {
  const eksStack = await EKSStack.createStack({ config });

  const provider = K8sProvider({
    config,
    manifests: await AwsLoadBalancerStack.loadManifest(),
    dependencies: { eks: eksStack.provider },
  });

  const awsLoadBalancerResources = await AwsLoadBalancerStack.createResources({
    provider,
    config,
    resources: eksStack.resources,
  });

  const baseStackResources = await BaseStack.createResources({
    provider,
    config,
    resources: eksStack.resources,
  });

  //TODO remove ?
  const albClusterRole = await createClusterRole({
    provider,
    config,
  });

  const ingress = await createIngress({
    provider,
    config,
    resources: {
      certificate: eksStack.resources.certificate,
      namespace: baseStackResources.namespace,
      serviceWebServer: baseStackResources.webServerChart.service,
      serviceRestServer: baseStackResources.restServerChart.service,
    },
  });

  return [
    eksStack,
    {
      provider,
      resources: {
        baseStackResources,
        awsLoadBalancerResources,
        albClusterRole,
        ingress,
      },
    },
  ];
};
