const assert = require("assert");
const { pipe, get } = require("rubico");
const { first } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");

const ModuleAwsEks = require("@grucloud/module-aws-eks/iac");
const ModuleK8sAwsLoadBalancerStack = require("@grucloud/module-k8s-aws-load-balancer-controller/iac");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate/iac");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

const BaseStack = require("../base/k8sStackBase");

const { createIngress } = require("./eksIngress");

const createAwsStack = async ({ stage }) => {
  const provider = AwsProvider({
    stage,
    configs: [
      ModuleAwsCertificate.config,
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
      ModuleAwsLoadBalancerController.config,
      require("./configAws"),
    ],
  });

  assert(provider.config.certificate);
  const { domainName, rootDomainName } = provider.config.certificate;
  assert(domainName);
  assert(rootDomainName);

  const domain = await provider.useRoute53Domain({
    name: rootDomainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const resourcesCertificate = await ModuleAwsCertificate.createResources({
    provider,
    resources: { hostedZone },
  });

  const resourcesVpc = await ModuleAwsVpc.createResources({ provider });

  const resourcesEks = await ModuleAwsEks.createResources({
    provider,
    resources: resourcesVpc,
  });

  const resourcesLbc = await ModuleAwsLoadBalancerController.createResources({
    provider,
    resources: resourcesEks,
  });

  return {
    provider,
    resources: {
      domain,
      hostedZone,
      certificate: resourcesCertificate,
      vpc: resourcesVpc,
      eks: resourcesEks,
      lbc: resourcesLbc,
    },
    isProviderUp: () => ModuleAwsEks.isProviderUp({ resources: resourcesEks }),
  };
};

const createK8sStack = async ({ stackAws, stage }) => {
  const provider = K8sProvider({
    stage,
    configs: [require("./configK8s"), ...BaseStack.configs],
    manifests: await ModuleK8sAwsLoadBalancerStack.loadManifest(),
    dependencies: { aws: stackAws.provider },
  });

  const awsLoadBalancerResources = await ModuleK8sAwsLoadBalancerStack.createResources(
    {
      provider,
      resources: stackAws.resources.lbc,
    }
  );

  const baseStackResources = await BaseStack.createResources({
    provider,
    resources: stackAws.resources,
  });

  const ingress = await createIngress({
    provider,
    resources: {
      certificate: stackAws.resources.certificate.certificate,
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

exports.createStack = async ({ stage }) => {
  const stackAws = await createAwsStack({ stage });
  const stackK8s = await createK8sStack({ stackAws, stage });

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
