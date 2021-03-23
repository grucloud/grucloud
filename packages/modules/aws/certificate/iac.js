const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = require("./hooks");
exports.hooks = hooks;

const makeDomainName = ({ DomainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${DomainName}`;

exports.makeDomainName = makeDomainName;

const createResources = async ({ provider }) => {
  const { config } = provider;
  assert(config.certificate);
  assert(config.certificate.rootDomainName);
  assert(config.certificate.domainName);

  const domain = await provider.useRoute53Domain({
    name: config.certificate.rootDomainName,
  });

  const domainName = makeDomainName({
    domainName: config.certificate.domainName,
    stage: config.stage,
  });

  const certificate = await provider.makeCertificate({
    name: domainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const certificateRecordValidation = await provider.makeRoute53Record({
    name: `certificate-validation-${domainName}.`,
    dependencies: { hostedZone, certificate },
    properties: ({ dependencies: { certificate } }) => {
      const domainValidationOption =
        certificate?.live?.DomainValidationOptions[0];
      const record = domainValidationOption?.ResourceRecord;
      if (domainValidationOption) {
        assert(
          record,
          `missing record in DomainValidationOptions, certificate ${JSON.stringify(
            certificate.live
          )}`
        );
      }
      return {
        Name: record?.Name,
        ResourceRecords: [
          {
            Value: record?.Value,
          },
        ],
        TTL: 300,
        Type: "CNAME",
      };
    },
  });

  return { certificate, hostedZone, certificateRecordValidation };
};

exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    config,
  });

  const resources = await createResources({
    provider,
  });

  return {
    provider,
    resources,
    hooks,
  };
};
