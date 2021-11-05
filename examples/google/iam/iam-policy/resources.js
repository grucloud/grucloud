const createResources = ({ provider }) => {
  const serviceAccount = provider.iam.makeServiceAccount({
    name: `sa-example-policy`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  const iamPolicy = provider.iam.makePolicy({
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
