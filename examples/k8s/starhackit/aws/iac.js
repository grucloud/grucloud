const assert = require("assert");
const { pipe, get } = require("rubico");
const { first } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const EKSStack = require("@grucloud/module-aws-eks/iac");
const AwsLoadBalancerStack = require("@grucloud/module-k8s-aws-load-balancer-controller/iac");
const AwsCertificateStack = require("@grucloud/module-aws-certificate/iac");

const BaseStack = require("../base/k8sStackBase");

const { createIngress } = require("./eksIngress");

const createAwsStack = async () => {
  const provider = AwsProvider({
    configs: [
      require("./configAws"),
      EKSStack.config,
      AwsCertificateStack.config,
    ],
  });

  const resourcesEks = await EKSStack.createResources({
    provider,
  });

  const resourcesCertificate = await AwsCertificateStack.createResources({
    provider,
  });

  return {
    provider,
    resources: { ...resourcesEks, ...resourcesCertificate },
    isProviderUp: () => EKSStack.isProviderUp({ resources: resourcesEks }),
  };
};

const createK8sStack = async ({ stackAws }) => {
  const provider = K8sProvider({
    config: require("./configK8s"),
    manifests: await AwsLoadBalancerStack.loadManifest(),
    dependencies: { aws: stackAws.provider },
  });

  const awsLoadBalancerResources = await AwsLoadBalancerStack.createResources({
    provider,
    resources: stackAws.resources,
  });

  const baseStackResources = await BaseStack.createResources({
    provider,
    resources: stackAws.resources,
  });

  const ingress = await createIngress({
    provider,
    resources: {
      certificate: stackAws.resources.certificate,
      namespace: baseStackResources.namespace,
      serviceWebServer: baseStackResources.webServerChart.service,
      serviceRestServer: baseStackResources.restServerChart.service,
    },
  });

  return {
    provider,
    resources: { baseStackResources, awsLoadBalancerResources, ingress },
  };
};

exports.createStack = async () => {
  const stackAws = await createAwsStack();
  const stackK8s = await createK8sStack({ stackAws });

  const { hostedZone } = stackAws.resources;
  assert(hostedZone);
  const { ingress } = stackK8s.resources;
  assert(ingress);

  const loadBalancerRecord = await stackAws.provider.makeRoute53Record({
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
    stackAws,
    {
      provider: stackK8s.provider,
      resources: {
        ...stackK8s.resources,
        loadBalancerRecord,
      },
    },
  ];
};
