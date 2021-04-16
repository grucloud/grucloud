const assert = require("assert");
const Axios = require("axios");

module.exports = ({
  resources: {
    lbc: { loadBalancer },
  },
}) => {
  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      init: async () => {},
      actions: [{}],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [],
    },
  };
};
