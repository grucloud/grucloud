const assert = require("assert");

module.exports = ({ resources }) => {
  return {
    onDeployed: {
      init: async () => {
        console.log("onDeployed");
        return {
          ip: await resources.ip.getLive(),
          server: await resources.server.getLive(),
        };
      },
      actions: [
        {
          name: "Ping",
          command: async ({ ip, server }) => {
            //console.log("do ping ", ip);
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
          name: "Ping",
          command: async () => {
            //console.log("do ping");
          },
        },
      ],
    },
  };
};
