const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsEKS = require("@grucloud/module-aws-eks");
const { createResources } = require("./resources");
exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    createResources,
    configs: [require("./config"), ModuleAwsEKS.config],
  });

  return {
    provider,
    //hooks: [ ...ModuleAwsEKS.hooks],
    // isProviderUp: () =>
    //   ModuleAwsEKS.isProviderUp({ resources: provider.resources() }),
  };
};
