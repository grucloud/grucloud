const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const { pipe, tap } = require("rubico");
const { K8sProvider } = require("@grucloud/core");
const { createResources } = require("./resources");
const hooks = require("./hooks");

const loadManifest = pipe([
  () => fs.readFile(path.join(__dirname, "./cert-manager.yaml")),
  yaml.loadAll,
]);

exports.loadManifest = loadManifest;

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = K8sProvider({
    name: "cert-manager",
    config: require("./config"),
  });
  const resources = await createResources({ provider });
  return {
    provider,
    resources,
    isProviderUp: pipe([
      () =>
        resources.certificaterequestsCertManagerIoCustomResourceDefinition.getLive(),
    ]),
    manifests: await loadManifest(),
    hooks,
  };
};
