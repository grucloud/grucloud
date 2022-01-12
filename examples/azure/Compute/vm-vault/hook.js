const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        // curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true -s
        return {};
      },
      actions: [
        {
          name: "TODO",
          command: async ({}) => {},
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Perform check",
          command: async ({}) => {},
        },
      ],
    },
  };
};
