const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources: { vpc, ig, subnet, rt, sg }, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Check Cluster",
          command: async ({}) => {},
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [],
    },
  };
};
