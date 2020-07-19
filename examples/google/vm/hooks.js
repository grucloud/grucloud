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
      console.log("google onDeployed");

      const ip = await resources.ip.getLive();
      const host = ip.address;
      const server = await resources.server.getLive();
      assert.equal(server.networkInterfaces[0].accessConfigs[0].natIP, host);
      //Ping

      const { alive } = await testPing({ host });
      console.log(`Ping ${host} alive: ${alive}`);

      // ssh with  gcloud compute ssh webserver-dev
    },
    onDestroyed: async () => {
      //console.log("google onDestroyed");
    },
  };
};
