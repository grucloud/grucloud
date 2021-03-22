const assert = require("assert");
const { pipe, get } = require("rubico");
const { first } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const BaseStack = require("../base/k8sStackBase");
const AwsLoadBalancerStack = require("../../aws-load-balancer/iac");

const EKSStack = require("../../../aws/eks/iac");
const { createIngress } = require("./eksIngress");

exports.createStack = async () => {
  // TODO create createStackAws and createStackK8s
  const providerAws = AwsProvider({ config: require("./configAws") });

  const resourcesAws = await EKSStack.createResources({
    provider: providerAws,
  });

  const providerK8s = K8sProvider({
    config: require("./configK8s"),
    manifests: await AwsLoadBalancerStack.loadManifest(),
    dependencies: { aws: providerAws },
  });

  const awsLoadBalancerResources = await AwsLoadBalancerStack.createResources({
    provider: providerK8s,
    resources: resourcesAws,
  });

  const baseStackResources = await BaseStack.createResources({
    provider: providerK8s,
    resources: resourcesAws,
  });

  const ingress = await createIngress({
    provider: providerK8s,
    resources: {
      certificate: resourcesAws.certificate,
      namespace: baseStackResources.namespace,
      serviceWebServer: baseStackResources.webServerChart.service,
      serviceRestServer: baseStackResources.restServerChart.service,
    },
  });
  const { hostedZone } = resourcesAws;
  assert(hostedZone);

  const loadBalancerRecord = await providerAws.makeRoute53Record({
    name: `dns-record-alias-load-balancer-${hostedZone.name}.`,
    dependencies: { hostedZone, ingress },
    properties: ({ dependencies }) => {
      const hostname = pipe([
        get("live.status.loadBalancer.ingress"),
        first,
        get("hostname"),
      ])(dependencies.ingress);
      if (!hostname) {
        return {
          message: "loadBalancer not up yet",
          Type: "A",
          Name: hostedZone.name,
        };
      }
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
    {
      provider: providerAws,
      resources: resourcesAws,
      isProviderUp: () => EKSStack.isProviderUp({ resources: resourcesAws }),
    },
    {
      provider: providerK8s,
      resources: {
        baseStackResources,
        awsLoadBalancerResources,
        ingress,
        loadBalancerRecord,
      },
    },
  ];
};
