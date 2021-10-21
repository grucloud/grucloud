const createResources = ({ provider }) => {
  const serviceAccount = provider.iam.makeServiceAccount({
    name: `sa-test-example`,
    properties: () => ({
      serviceAccount: {
        displayName: "SA dev",
      },
    }),
  });

  const iamBinding = provider.iam.makeBinding({
    name: "roles/firebasenotifications.viewer",
    dependencies: ({ resources }) => {
      return { serviceAccounts: [resources.iam.ServiceAccount.saTestExample] };
    },
    properties: () => ({}),
  });

  return {
    iamBinding,
  };
};

exports.createResources = createResources;
