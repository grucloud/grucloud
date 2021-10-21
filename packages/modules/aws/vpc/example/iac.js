const { AwsProvider } = require("@grucloud/provider-aws");
//const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsVpc = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    createResources: ModuleAwsVpc.createResources,
    configs: [require("./config"), ModuleAwsVpc.config],
  });

  return {
    provider,
  };
};
