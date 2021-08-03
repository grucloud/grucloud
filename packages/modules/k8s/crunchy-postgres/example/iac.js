const { K8sProvider } = require("@grucloud/provider-k8s");
const CrunchyPostgres = require("../iac");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(K8sProvider, { config: () => ({}) });
  const namespace = provider.makeNamespace({
    name: "pgo",
  });

  const resources = await CrunchyPostgres.createResources({ provider });
  return { provider, resources: { namespace, ...resources } };
};
