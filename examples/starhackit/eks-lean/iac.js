const assert = require("assert");
const { pipe, get } = require("rubico");
const { first, pluck } = require("rubico/x");

const { AwsProvider } = require("@grucloud/provider-aws");
const { K8sProvider } = require("@grucloud/provider-k8s");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks/iac");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate/iac");

const BaseStack = require("../base/k8sStackBase");

const LoadBalancer = require("./loadBalancer");

const createAwsStack = async ({ stage }) => {
  const provider = AwsProvider({
    stage,
    configs: [
      ModuleAwsCertificate.config,
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
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

  return {
    provider,
    resources: {
      domain,
      hostedZone,
      certificate: resourcesCertificate,
      vpc: resourcesVpc,
      eks: resourcesEks,
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

  const lbResources = await LoadBalancer.createResources({
    provider: stackAws.provider,
    resources: {
      certificate: stackAws.resources.certificate.certificate,
      vpc: stackAws.resources.vpc.vpc,
      hostedZone: stackAws.resources.hostedZone,
      subnets: stackAws.resources.vpc.subnetsPublic,
      eks: stackAws.resources.eks,
      k8s: stackK8s.resources,
    },
  });

  return {
    stacks: [
      {
        ...stackAws,
        resources: { ...stackAws.resources, lbResources },
      },
      stackK8s,
    ],
  };
};
