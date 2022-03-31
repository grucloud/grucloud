const assert = require("assert");

module.exports = ({ provider }) => {
  return {
    onDeployed: {
      init: async () => {
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
