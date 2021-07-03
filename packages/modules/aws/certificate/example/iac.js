const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [config, ModuleAwsCertificate.config],
  });

  assert(provider.config.certificate);
  const { domainName, rootDomainName } = provider.config.certificate;
  assert(domainName);
  assert(rootDomainName);

  const domain = await provider.route53Domain.useRoute53Domain({
    name: rootDomainName,
  });

  const hostedZone = await provider.route53.makeHostedZone({
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
