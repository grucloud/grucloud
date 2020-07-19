const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 3,
  });

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: {
      init: async () => {
        const ip = await resources.ip.getLive();
        assert(ip, "ip is not live");
        const host = ip.address;

        const server = await resources.server.getLive();
        assert.equal(server.networkInterfaces[0].accessConfigs[0].natIP, host);

        return {
          host,
        };
      },
      actions: [
        {
          name: "Ping",
          command: async ({ host }) => {
            const { alive } = await testPing({ host });
            assert(alive, `Cannot ping ${host}`);
          },
        },
      ],
    },

    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Perform check",
          command: async ({}) => {},
        },
      ],
    },
  };
};
