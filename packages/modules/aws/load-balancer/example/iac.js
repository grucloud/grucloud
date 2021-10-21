const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsCertificate = require("@grucloud/module-aws-certificate");
const ModuleAwsLoadBalancer = require("@grucloud/module-aws-load-balancer");

const { createResources } = require("./resources");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    createResources,
    configs: [
      require("./config"),
      ModuleAwsLoadBalancer.config,
      ModuleAwsCertificate.config,
      //ModuleAwsVpc.config,
    ],
  });

  return {
    provider,
    hooks: [...ModuleAwsCertificate.hooks, ...ModuleAwsVpc.hooks],
  };
};
