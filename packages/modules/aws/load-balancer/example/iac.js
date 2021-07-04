const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

exports.createStack = async ({ stage }) => {
  const provider = AwsProvider({
    stage,
    configs: [
      ModuleAwsCertificate.config,
      //ModuleAwsVpc.config,
      ModuleAwsLoadBalancer.config,
      require("./config"),
    ],
  });

  assert(provider.config.certificate);
  const { domainName, rootDomainName } = provider.config.certificate;
  assert(domainName);
  assert(rootDomainName);

  const domain = provider.route53Domain.useDomain({
    name: rootDomainName,
  });

  const hostedZone = provider.route53.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const resourcesCertificate = await ModuleAwsCertificate.createResources({
    provider,
    resources: { hostedZone },
  });

  const resourcesVpc = await ModuleAwsVpc.createResources({ provider });

  const resourcesLb = await ModuleAwsLoadBalancer.createResources({
    provider,
    resources: {
      certificate: resourcesCertificate.certificate,
      vpc: resourcesVpc.vpc,
      hostedZone,
      subnets: resourcesVpc.subnetsPublic,
    },
  });

  return {
    provider,
    resources: {
      domain,
      hostedZone,
      certificate: resourcesCertificate,
      vpc: resourcesVpc,
      lb: resourcesLb,
    },
    hooks: [...ModuleAwsCertificate.hooks, ...ModuleAwsVpc.hooks],
  };
};
