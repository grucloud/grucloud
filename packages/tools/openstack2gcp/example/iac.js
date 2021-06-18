const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const { stage } = provider.config;

  const extNet = await provider.makeNetwork({
    name: "Ext-Net",
    properties: () => ({ autoCreateSubnetworks: false }),
  });

  return {};
};
exports.createResources = createResources;

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });
  const { stage } = provider.config;
  assert(stage, "missing stage");

  const resources = await createResources({
    provider,
    resources: {},
  });

  return {
    provider,
    resources,
  };
};
