const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        // TODO do ping and ssh
        return {};
      },
      actions: [
        {
          name: "Ping",
          command: async ({}) => {
            //console.log("do ping ");
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        console.log("onDestroyed");
      },
      actions: [
        {
          name: "So Stuff",
          command: async () => {},
        },
      ],
    },
  };
};
