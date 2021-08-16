const assert = require("assert");
const { GoogleProvider } = require("@grucloud/provider-google");
const hook = require("./hook");

const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const iamBinding = provider.iam.makeBinding({
    name: "roles/firebasenotifications.viewer",
    dependencies: { serviceAccounts: [serviceAccount] },
    properties: () => ({}),
  });

  return {
    iamBinding,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });

  const serviceAccount = provider.iam.makeServiceAccount({
    name: `sa-test-example`,
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
    hooks: [hook],
  };
};
