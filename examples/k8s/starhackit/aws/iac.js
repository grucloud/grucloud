const assert = require("assert");
const { pipe, get } = require("rubico");
const { first } = require("rubico/x");

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
  const { hostedZone } = eksStack.resources;
  assert(hostedZone);

  const loadBalancerRecord = await eksStack.provider.makeRoute53Record({
    name: `dns-record-alias-load-balancer-${hostedZone.name}.`,
    dependencies: { hostedZone, ingress },
    properties: ({ dependencies }) => {
      const loadBalancer = pipe([
        get("live.status.loadBalancer.ingress"),
        first,
      ])(dependencies.ingress);
      if (!loadBalancer) {
        return {
          message: "loadBalancer not up yet",
          Type: "A",
          Name: hostedZone.name,
        };
      }
      const { hostname } = loadBalancer;
      assert(hostname);
      return {
        Name: hostedZone.name,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "ZHURV8PSTC4K8",
          DNSName: hostname,
          EvaluateTargetHealth: false,
        },
      };
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
        loadBalancerRecord,
      },
    },
  ];
};
