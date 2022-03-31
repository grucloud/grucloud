const assert = require("assert");

module.exports = ({ provider }) => {
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "check lambda",
          command: async ({ client }) => {},
        },
      ],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
