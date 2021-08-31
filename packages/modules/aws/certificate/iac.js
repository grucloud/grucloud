const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = [require("./hook")];
exports.hooks = hooks;

const NamespaceDefault = "Certificate";

const makeDomainName = ({ domainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${domainName}`;

exports.makeDomainName = makeDomainName;

const createResources = async ({
  provider,
  resources: { hostedZone },
  namespace = NamespaceDefault,
}) => {
  const { config } = provider;
  assert(config.certificate);
  assert(config.certificate.domainName);

  const { domainName } = config.certificate;

  const certificate = provider.ACM.makeCertificate({
    name: domainName,
    namespace,
  });

  const certificateRecordValidation = provider.Route53.makeRecord({
    name: `certificate-validation-${domainName}.`,
    namespace,
    dependencies: { hostedZone, certificate },
  });

  return { certificate, certificateRecordValidation };
};

exports.createResources = createResources;
