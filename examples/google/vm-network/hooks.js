const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 3,
  });

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: async () => {
      console.log("google vm-network onDeployed");

      const server = await resources.server.getLive();
    },
    onDestroyed: async () => {
      //console.log("google onDestroyed");
    },
  };
};
