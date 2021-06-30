const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const { topLevelDomain, subDomainName = "", recordTxtValue } = config;
  assert(topLevelDomain);
  assert(recordTxtValue);

  const hostedZone = await provider.makeHostedZone({
    name: `${topLevelDomain}.`,
    dependencies: {},
  });

  const recordTxt = await provider.makeRoute53Record({
    name: `txt.${subDomainName}${topLevelDomain}.`,
    dependencies: { hostedZone },
    properties: () => ({
      Name: `${subDomainName}${topLevelDomain}.`,
      ResourceRecords: [
        {
          Value: `"${recordTxtValue}"`,
        },
      ],
      TTL: 60,
      Type: "TXT",
    }),
  });
  return { hostedZone, recordTxt };
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({
    config: require("./config"),
  });

  const resources = await createResources({
    provider,
  });

  return {
    provider,
    resources,
    hooks: [hook],
  };
};
