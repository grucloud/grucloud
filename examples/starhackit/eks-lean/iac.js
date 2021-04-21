const assert = require("assert");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

const BaseStack = require("../base/k8sStackBase");

const createAwsStack = async ({ stage }) => {
  const provider = AwsProvider({
    stage,
    configs: [
      ModuleAwsCertificate.config,
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
      ModuleAwsLoadBalancer.config,
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

  const resourcesLb = await ModuleAwsLoadBalancer.createResources({
    provider,
    resources: {
      certificate: resourcesCertificate.certificate,
      vpc: resourcesVpc.vpc,
      hostedZone,
      subnets: resourcesVpc.subnetsPublic,
      eks: resourcesEks,
    },
  });

  return {
    provider,
    resources: {
      domain,
      hostedZone,
      certificate: resourcesCertificate,
      vpc: resourcesVpc,
      eks: resourcesEks,
      lb: resourcesLb,
    },
    hooks: [
      ...ModuleAwsCertificate.hooks,
      ...ModuleAwsVpc.hooks,
      ...ModuleAwsEks.hooks,
    ],
    isProviderUp: () => ModuleAwsEks.isProviderUp({ resources: resourcesEks }),
  };
};

const createK8sStack = async ({ stackAws, stage }) => {
  const provider = K8sProvider({
    stage,
    configs: [require("./configK8s"), ...BaseStack.configs],
    dependencies: { aws: stackAws.provider },
  });

  const baseStackResources = await BaseStack.createResources({
    provider,
    resources: stackAws.resources,
  });

  return {
    provider,
    resources: { baseStackResources },
    hooks: [...BaseStack.hooks],
  };
};

exports.createStack = async ({ stage }) => {
  const stackAws = await createAwsStack({ stage });
  const stackK8s = await createK8sStack({ stackAws, stage });

  return {
    hookGlobal: require("./hookGlobal"),
    stacks: [stackAws, stackK8s],
  };
};
