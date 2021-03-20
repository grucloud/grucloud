const fs = require("fs").promises;
const yaml = require("js-yaml");
const path = require("path");
const { pipe, tap } = require("rubico");

const { K8sProvider } = require("@grucloud/core");
const LoadBalancerResources = require("./resources");
const CertManager = require("../cert-manager/iac");

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

exports.createStack = async () => {
  const manifests = await CertManager.loadManifest();

  const provider = K8sProvider({
    config: require("./config"),
    manifests,
  });

  const resources = await createResources({ provider });

  return [{ provider, resources }];
};
