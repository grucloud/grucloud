const createResources = ({ provider }) => {
  provider.iam.makeServiceAccount({
    name: `sa-example-policy`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  const iamPolicy = provider.iam.makePolicy({
    name: "policy",
    dependencies: { serviceAccount: "sa-example-policy" },
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
