const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [
      ModuleAwsEks.config,
      ModuleAwsVpc.config,
      ModuleAwsLoadBalancerController.config,
      config,
    ],
  });

  const resourceVpc = await ModuleAwsVpc.createResources({ provider });

  const resourceEks = await ModuleAwsEks.createResources({
    provider,
    resources: resourceVpc,
  });

  const resourceLbc = await ModuleAwsLoadBalancerController.createResources({
    provider,
    resources: resourceEks,
  });

  return {
    provider,
    resources: { vpb: resourceVpc, resourceEks, lbc: resourceLbc },
  };
};
