const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({ stage }) => {
  const provider = AwsProvider({ config: require("./config"), stage });
  const { config } = provider;
  const ec2Instance = await provider.makeEC2({
    name: config.ec2Instance.name,
    properties: () => config.ec2Instance.properties,
  });

  return {
    provider,
    resources: { ec2Instance },
  };
};
