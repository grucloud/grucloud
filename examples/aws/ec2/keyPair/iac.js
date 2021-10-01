// Generated by aws2gc
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.EC2.makeKeyPair({
    name: "kp",
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
