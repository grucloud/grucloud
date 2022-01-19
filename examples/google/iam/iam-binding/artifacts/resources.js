// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.iam.makeServiceAccount({
    name: "sa-test-example",
    properties: ({}) => ({
      serviceAccount: {
        displayName: "SA dev",
        description: "Managed By GruCloud",
      },
    }),
  });

  provider.iam.makeBinding({
    name: "roles/firebasenotifications.viewer",
    dependencies: ({ resources }) => ({
      serviceAccounts: [resources.iam.ServiceAccount["sa-test-example"]],
    }),
  });
};

exports.createResources = createResources;
