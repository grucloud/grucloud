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
            if (process.env.CONTINUOUS_INTEGRATION) {
              // cannot ping from circleci container
              return;
            }
            await retryCall({
              name: `ping ${host}`,
              fn: async () => {
                await testPing({ host });
                return true;
              },
              shouldRetryOnException: () => true,
              config: { retryCount: 40, retryDelay: 5e3 },
            });
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
