const fs = require("fs").promises;
const yaml = require("js-yaml");
const path = require("path");
const { pipe, tap } = require("rubico");

const { AwsProvider } = require("@grucloud/provider-aws");
const EKSStack = require("@grucloud/module-aws-eks/iac");

const { K8sProvider } = require("@grucloud/provider-k8s");
const CertManager = require("@grucloud/module-k8s-cert-manager/iac");

const LoadBalancerResources = require("./resources");

const createResources = async ({ provider, resources }) => {
  const certResources = await CertManager.createResources({ provider });
  const loadBalancerResources = await LoadBalancerResources.createResources({
    provider,
    resources,
  });
  return { ...certResources, ...loadBalancerResources };
};

exports.createResources = ({ provider, resources }) => {
  return createResources({ provider, resources });
};

const loadManifest = pipe([
  () =>
    fs.readFile(path.join(__dirname, "./aws-load-balancer-controller.yaml")),
  yaml.loadAll,
]);

exports.loadManifest = async () => [
  ...(await CertManager.loadManifest()),
  ...(await loadManifest()),
];

const createStackAws = async () => {
  const provider = AwsProvider({
    configs: [require("./configAws"), EKSStack.config],
  });

  const resources = await EKSStack.createResources({
    provider,
  });
  return {
    provider,
    resources,
    isProviderUp: () => EKSStack.isProviderUp({ resources }),
  };
};

const createStackK8s = async ({ stackAws }) => {
  const manifests = await CertManager.loadManifest();

  const provider = K8sProvider({
    config: require("./configK8s"),
    manifests,
    dependencies: { aws: stackAws.provider },
  });

  const resources = await createResources({
    provider,
    resources: stackAws.resources,
  });

  return { provider, resources };
};

exports.createStack = async () => {
  const stackAws = await createStackAws();
  const stackK8s = await createStackK8s({ stackAws });
  return [stackAws, stackK8s];
};
