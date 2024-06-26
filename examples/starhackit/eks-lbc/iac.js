const assert = require("assert");
const { pipe, get, tap, and, eq } = require("rubico");
const { find } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");

const { K8sProvider } = require("@grucloud/provider-k8s");

const ModuleCertManager = require("@grucloud/module-k8s-cert-manager");
const ModuleK8sAwsLoadBalancer = require("@grucloud/module-k8s-aws-load-balancer-controller");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

const BaseStack = require("../base/k8sStackBase");

const { createIngress } = require("./eksIngress");

const createAwsStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [
      require("./configAws"),
      ModuleAwsLoadBalancerController.config,
      ModuleAwsEks.config,
      ModuleAwsCertificate.config,
      ModuleAwsVpc.config,
    ],
  });

  assert(provider.config.certificate);
  const { domainName, rootDomainName } = provider.config.certificate;
  assert(domainName);
  assert(rootDomainName);

  const domain = provider.Route53Domains.useDomain({
    name: rootDomainName,
  });

  const hostedZone = provider.Route53.makeHostedZone({
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
    hooks: [
      ...ModuleAwsCertificate.hooks,
      ...ModuleAwsVpc.hooks,
      ...ModuleAwsEks.hooks,
    ],
    isProviderUp: () => ModuleAwsEks.isProviderUp({ resources: resourcesEks }),
  };
};

const createK8sStack = async ({ createProvider, stackAws }) => {
  const provider = createProvider(K8sProvider, {
    configs: [
      require("./configK8s"),
      ModuleCertManager.config,
      ModuleK8sAwsLoadBalancer.config,
      ...BaseStack.configs,
    ],
    manifests: [
      ...(await ModuleCertManager.loadManifest()),
      ...(await ModuleK8sAwsLoadBalancer.loadManifest()),
    ],
    dependencies: { aws: stackAws.provider },
  });

  const certManagerResources = await ModuleCertManager.createResources({
    provider,
  });

  const k8sLoadBalancerResources =
    await ModuleK8sAwsLoadBalancer.createResources({
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
      certificate: stackAws.resources.certificate.certificate,
      namespace: baseStackResources.namespace,
      serviceWebServer: baseStackResources.webServerResources.service,
      serviceRestServer: baseStackResources.restServerResources.service,
    },
  });

  return {
    provider,
    resources: {
      baseStackResources,
      certManagerResources,
      k8sLoadBalancerResources,
      ingress,
    },
  };
};

exports.createStack = async ({ createProvider }) => {
  const stackAws = await createAwsStack({ createProvider });
  const stackK8s = await createK8sStack({ createProvider, stackAws });

  const { hostedZone, eks } = stackAws.resources;
  assert(hostedZone);
  const { ingress } = stackK8s.resources;
  assert(ingress);

  const loadBalancer = await stackAws.provider.ELBv2.useLoadBalancer({
    name: "load-balancer",
    filterLives: ({ resources }) =>
      pipe([
        () => resources,
        find(
          pipe([
            tap((xxx) => {
              assert(true);
            }),
            get("live.Tags"),
            find(
              and([
                eq(get("Key"), "elbv2.k8s.aws/cluster"),
                eq(get("Value"), eks.cluster.name),
              ])
            ),
          ])
        ),
        tap((lb) => {
          assert(true);
        }),
      ])(),
  });

  const loadBalancerRecord = stackAws.provider.Route53.makeRecord({
    name: `dns-record-alias-load-balancer-${hostedZone.name}`,
    dependencies: { hostedZone, loadBalancer },
  });

  return {
    stacks: [
      stackAws,
      {
        provider: stackK8s.provider,
        resources: {
          ...stackK8s.resources,
          loadBalancerRecord,
        },
      },
    ],
  };
};
