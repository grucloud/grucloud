const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");

const createResources = ({ provider }) => {
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

  const certificateResources = ModuleAwsCertificate.createResources({
    provider,
    resources: { hostedZone },
  });
};

exports.createStack = async ({ createProvider }) => {
  return {
    provider: createProvider(AwsProvider, {
      createResources,
      configs: [require("./config"), ModuleAwsCertificate.config],
    }),
    hooks: [...ModuleAwsCertificate.hooks],
  };
};
