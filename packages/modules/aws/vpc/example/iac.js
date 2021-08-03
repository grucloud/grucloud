const { AwsProvider } = require("@grucloud/provider-aws");
//const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsVpc = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [require("./config"), ModuleAwsVpc.config],
  });
  const resources = await ModuleAwsVpc.createResources({
    provider,
  });
  return {
    provider,
    resources,
  };
};
