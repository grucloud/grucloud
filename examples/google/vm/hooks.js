const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

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
            const alive = await retryCall({
              name: `ping ${host}`,
              fn: async () => {
                const { alive } = await testPing({ host });
                if (!alive) {
                  throw Error(`cannot ping ${host} yet`);
                }
                return alive;
              },
              shouldRetryOnException: () => true,
              retryCount: 20,
              retryDelay: 2e3,
            });
            assert(alive, `cannot ping ${host}`);
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
