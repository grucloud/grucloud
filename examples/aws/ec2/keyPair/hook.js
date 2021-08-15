const assert = require("assert");

module.exports = ({ provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {},
      actions: [
        {
          name: "Check",
          command: async () => {},
        },
      ],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
