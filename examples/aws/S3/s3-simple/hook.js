const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const host = "myhost";
        return { host };
      },
    },
    onDestroyed: {
      init: async () => {
        return {};
      },
    },
  };
};
