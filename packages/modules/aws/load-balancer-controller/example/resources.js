const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

exports.createResources = async ({ provider }) => {
  const resourceEks = await ModuleAwsEks.createResources({
    provider,
  });

  const resourceLbc = await ModuleAwsLoadBalancerController.createResources({
    provider,
    resources: resourceEks,
  });

  return {
    provider,
  };
};
