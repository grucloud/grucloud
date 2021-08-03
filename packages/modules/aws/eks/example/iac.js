const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEKS = require("@grucloud/module-aws-eks");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [require("./config"), ModuleAwsVpc.config, ModuleAwsEKS.config],
  });

  const vpcResources = await ModuleAwsVpc.createResources({
    provider,
  });

  const eksResources = await ModuleAwsEKS.createResources({
    provider,
    resources: vpcResources,
  });

  return {
    provider,
    resources: { vpc: vpcResources, eks: eksResources },
    hooks: [...ModuleAwsVpc.hooks, ...ModuleAwsEKS.hooks],
    isProviderUp: () => ModuleAwsEKS.isProviderUp({ resources: eksResources }),
  };
};
