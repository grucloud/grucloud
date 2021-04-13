const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = [require("./hook")];
exports.hooks = hooks;

const makeDomainName = ({ domainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${domainName}`;

exports.makeDomainName = makeDomainName;

const createResources = async ({ provider, resources: { hostedZone } }) => {
  const { config } = provider;
  assert(config.certificate);
  assert(config.certificate.domainName);

  const { domainName } = config.certificate;

  const certificate = await provider.makeCertificate({
    name: domainName,
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

  return { certificate, certificateRecordValidation };
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
