const assert = require("assert");
const { GoogleProvider } = require("@grucloud/core");
const hooks = require("./hooks");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const iamBinding = await provider.makeIamBinding({
    name: "roles/firebasenotifications.viewer",
    dependencies: { serviceAccounts: [serviceAccount] },
    properties: () => ({}),
  });

  return {
    iamBinding,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ config }) => {
  const provider = GoogleProvider({ config });
  const { stage } = provider.config();
  assert(stage, "missing stage");

  const serviceAccount = await provider.makeServiceAccount({
    name: `sa-${stage}`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  const resources = await createResources({
    provider,
    resources: { serviceAccount },
  });

  return {
    provider,
    resources,
    hooks,
  };
};
