const assert = require("assert");
const { retryCall } = require("@grucloud/core").Retry;

module.exports = ({ resources: {}, provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {},
      actions: [
        {
          name: "TODO",
          command: async () => {},
        },
      ],
    },
    onDestroyed: {
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
