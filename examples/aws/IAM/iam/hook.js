const assert = require("assert");

module.exports = ({ provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
