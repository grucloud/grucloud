const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const { pipe } = require("rubico");
const { K8sProvider } = require("@grucloud/core");
const { createResources } = require("./resources");
const hooks = require("./hooks");

const decodeManifest = pipe([
  () => fs.readFile(path.join(__dirname, "./cert-manager.yaml")),
  yaml.loadAll,
]);

exports.createStack = async ({ config }) => {
  const provider = K8sProvider({ name: "cert-manager", config });
  const resources = await createResources({ provider });
  return {
    provider,
    resources,
    isProviderUp: () => resources.certManagerDeployment.getLive(),
    manifests: await decodeManifest(),
    hooks,
  };
};
