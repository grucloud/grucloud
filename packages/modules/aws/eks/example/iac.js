const assert = require("assert");
const { pipe, tap, and } = require("rubico");

const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEKS = require("@grucloud/module-aws-eks");

const isProviderUp = ({ resources }) =>
  pipe([
    and([() => resources.cluster.getLive()]),
    tap((isUp) => {
      assert(true);
    }),
  ])();

exports.isProviderUp = isProviderUp;

exports.createStack = async ({ config }) => {
  const provider = AwsProvider({
    configs: [ModuleAwsVpc.config, ModuleAwsEKS.config, config],
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
    //hooks,
    isProviderUp: () => isProviderUp({ resources: eksResources }),
  };
};
