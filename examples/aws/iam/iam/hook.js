const assert = require("assert");

module.exports = ({ resources: { eip, server }, provider }) => {
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
