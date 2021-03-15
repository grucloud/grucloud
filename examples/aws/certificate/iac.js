const assert = require("assert");
const { AwsProvider } = require("@grucloud/core");
const hooks = require("./hooks");

const makeDomainName = ({ DomainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${DomainName}`;

exports.makeDomainName = makeDomainName;

const createResources = async ({ provider }) => {
  const config = provider.config();
  const { DomainName, stage } = config;

  assert(DomainName);
  assert(stage);

  const domainName = makeDomainName({
    DomainName,
    stage,
  });

  const certificate = await provider.makeCertificate({
    name: `certificate-${DomainName}-${stage}`,
    config: { region: "us-east-1" },
    properties: () => ({
      DomainName: domainName,
    }),
  });

  const domain = await provider.useRoute53Domain({
    name: DomainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const recordValidation = await provider.makeRoute53Record({
    name: `validation-${domainName}.`,
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

  return { certificate, hostedZone, recordValidation };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({
    name,
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
