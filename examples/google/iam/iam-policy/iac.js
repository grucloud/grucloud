const assert = require("assert");
const { GoogleProvider } = require("@grucloud/core");
const hooks = require("./hooks");

//TODO do we use a name ?
//TODO how do we prevent being created twice
const createResources = async ({ provider, resources: { serviceAccount } }) => {
  const iamPolicy = await provider.makeIamPolicy({
    name: "policy",
    dependencies: { serviceAccount },

    properties: ({ dependencies: { serviceAccount } }) => ({
      policy: {
        bindings: [
          {
            role: "roles/editor",
            members: [`serviceAccount:${serviceAccount.live?.email}`],
          },
        ],
      },
    }),
  });

  return {
    iamPolicy,
  };
};
exports.createResources = createResources;

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });
  const { stage } = provider.config;
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
