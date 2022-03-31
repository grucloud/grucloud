const assert = require("assert");

module.exports = ({ provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      actions: [
        /*{
          name: "Ping",
          command: async ({ host }) => {
          },
        },*/
      ],
    },
    onDestroyed: {
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
