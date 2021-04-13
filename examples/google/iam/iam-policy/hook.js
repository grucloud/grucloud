const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Check",
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
