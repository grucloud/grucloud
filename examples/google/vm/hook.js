const assert = require("assert");
const ping = require("ping");
const { retryCall } = require("@grucloud/core").Retry;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 3,
  });

module.exports = ({ provider }) => {
  return {
    onDeployed: {
      init: async () => {
        return {};
      },
      // actions: [
      //   {
      //     name: "Ping",
      //     command: async ({ host }) => {
      //       if (process.env.CONTINUOUS_INTEGRATION) {
      //         // cannot ping from circleci container
      //         return;
      //       }
      //       await retryCall({
      //         name: `ping ${host}`,
      //         fn: async () => {
      //           await testPing({ host });
      //           return true;
      //         },
      //         shouldRetryOnException: () => true,
      //         config: { retryCount: 40, retryDelay: 5e3 },
      //       });
      //     },
      //   },
      // ],
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
