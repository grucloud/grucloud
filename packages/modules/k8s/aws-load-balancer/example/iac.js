const { pipe, tap } = require("rubico");

const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleAwsVpc = require("@grucloud/module-aws-vpc");
const ModuleAwsEks = require("@grucloud/module-aws-eks");
//TODO rename @grucloud/module-aws-load-balancer-controller-role
const ModuleAwsLoadBalancerController = require("@grucloud/module-aws-load-balancer-controller");

const { K8sProvider } = require("@grucloud/provider-k8s");
const ModuleCertManager = require("@grucloud/module-k8s-cert-manager");
const ModuleK8sLoadBalancerController = require("@grucloud/module-k8s-aws-load-balancer-controller");

const createStackAws = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    configs: [
      require("./configAws"),
      ModuleAwsLoadBalancerController.config,
      ModuleAwsVpc.config,
      ModuleAwsEks.config,
    ],
  });

  const resourcesVpc = await ModuleAwsVpc.createResources({ provider });

  const resourcesEks = await ModuleAwsEks.createResources({
    provider,
    resources: resourcesVpc,
  });

  const resourcesLbc = await ModuleAwsLoadBalancerController.createResources({
    provider,
    resources: resourcesEks,
  });

  return {
    provider,
    resources: {
      vpc: resourcesVpc,
      eks: resourcesEks,
      lbc: resourcesLbc,
    },
    hooks: [...ModuleAwsVpc.hooks, ...ModuleAwsEks.hooks],
    isProviderUp: () => ModuleAwsEks.isProviderUp({ resources: resourcesEks }),
  };
};

const createStackK8s = async ({ createProvider, stackAws }) => {
  const provider = createProvider(K8sProvider, {
    configs: [
      require("./configK8s"),
      ModuleK8sLoadBalancerController.config,
      ModuleCertManager.config,
    ],
    manifests: [
      ...(await ModuleCertManager.loadManifest()),
      ...(await ModuleK8sLoadBalancerController.loadManifest()),
    ],
    dependencies: { aws: stackAws.provider },
  });

  const certResources = await ModuleCertManager.createResources({ provider });

  const lbcResources = await ModuleK8sLoadBalancerController.createResources({
    provider,
    resources: stackAws.resources,
  });

  return { provider, resources: { certResources, lbcResources } };
};

exports.createStack = async ({ createProvider }) => {
  const stackAws = await createStackAws({ createProvider });
  const stackK8s = await createStackK8s({ createProvider, stackAws });
  return {
    //TODO hookGlobal: require("./hookGlobal"),
    stacks: [stackAws, stackK8s],
  };
};
