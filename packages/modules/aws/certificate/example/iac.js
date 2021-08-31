const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [require("./config"), ModuleAwsCertificate.config],
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

  const certificateResources = await ModuleAwsCertificate.createResources({
    provider,
    resources: { hostedZone },
  });

  return {
    provider,
    resources: { domain, hostedZone, certificate: certificateResources },
    hooks: [...ModuleAwsCertificate.hooks],
  };
};
