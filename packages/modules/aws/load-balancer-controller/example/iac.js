const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

const { createResources } = require("./resources");

exports.createStack = async ({ createProvider }) => {
  const provider = await createProvider(AwsProvider, {
    createResources,
    configs: [
      require("./config"),
      ModuleAwsLoadBalancerController.config,
      ModuleAwsEks.config,
    ],
  });

  return {
    provider,
  };
};
