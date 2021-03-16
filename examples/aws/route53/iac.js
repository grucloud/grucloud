const assert = require("assert");
const { AwsProvider } = require("@grucloud/core");
const hooks = require("./hooks");

const makeDomainName = ({ domainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${domainName}`;

exports.makeDomainName = makeDomainName;

const createResources = async ({ provider }) => {
  const config = provider.config();
  const { stage } = config;

  assert(config.domainName);
  assert(stage);

  const domainName = makeDomainName({
    domainName: config.topLevelDomain,
    stage,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: {},
  });

  const recordA = await provider.makeRoute53Record({
    name: `a.sub.${domainName}.`,
    dependencies: { hostedZone },
    properties: () => ({
      Name: `sub.${domainName}.`,
      ResourceRecords: [
        {
          Value: "192.0.2.45",
        },
      ],
      TTL: 60,
      Type: "A",
    }),
  });
  return { hostedZone, recordA };
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
