// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  const { config } = provider;

  provider.ec2.useDefaultVpc({
    name: config.ec2.Vpc.vpcDefault.name,
  });

  provider.ec2.makeKeyPair({
    name: config.ec2.KeyPair.kpEc2Example.name,
    properties: () => config.ec2.KeyPair.kpEc2Example.properties,
  });

  provider.ec2.makeElasticIpAddress({
    name: config.ec2.ElasticIpAddress.eip.name,
  });

  provider.ec2.useDefaultSecurityGroup({
    name: config.ec2.SecurityGroup.sgDefaultVpcDefault.name,
    dependencies: ({ resources }) => ({
      vpc: resources.ec2.Vpc.vpcDefault,
    }),
  });

  provider.ec2.makeInstance({
    name: config.ec2.Instance.webServerEc2Example.name,
    dependencies: ({ resources }) => ({
      keyPair: resources.ec2.KeyPair.kpEc2Example,
      eip: resources.ec2.ElasticIpAddress.eip,
    }),
    properties: () => config.ec2.Instance.webServerEc2Example.properties,
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};