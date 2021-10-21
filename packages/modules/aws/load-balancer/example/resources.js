const assert = require("assert");

const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

exports.createResources = async ({ provider }) => {
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

  const resourcesLb = await ModuleAwsLoadBalancer.createResources({
    provider,
    resources: {
      certificate: resourcesCertificate.certificate,
      vpc: resourcesVpc.vpc,
      hostedZone,
      subnets: resourcesVpc.subnetsPublic,
    },
  });
};
