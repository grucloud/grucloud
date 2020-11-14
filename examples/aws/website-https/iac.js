const { AwsProvider } = require("@grucloud/core");
const { pipe, map } = require("rubico");

const createResources = async ({ provider, config }) => {
  const { domainName } = config;
  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}`,
    properties: () => ({
      RecordSet: [
        {
          Name: domainName,
          ResourceRecords: [
            {
              Value: "192.0.2.44",
            },
          ],
          TTL: 60,
          Type: "A",
        },
      ],
    }),
  });

  const certificate = await provider.makeCertificate({
    name: `certificate-${domainName}`,
    properties: () => ({ DomainName: domainName }),
  });
  return { hostedZone, certificate };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({ name, config });
  const resources = await createResources({ provider, config });
  return { provider, resources };
};
