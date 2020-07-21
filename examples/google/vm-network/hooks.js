const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        /*return {
          ip: await resources.ip.getLive(),
          server: await resources.server.getLive(),
        };*/
      },
      /*
      actions: [
        {
          name: "Check google network",
          command: async ({ ip, server }) => {
            //console.log("do stuff ", ip);
          },
        },
      ],*/
    },
  };
};
