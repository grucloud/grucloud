const assert = require("assert");
const ping = require("ping");
const Promise = require("bluebird");

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

module.exports = ({ resources }) => {
  return {
    onDeployed: {
      init: async () => {
        //console.log("onDeployed");
        const host = "www.google.com";
        return {
          host,
        };
      },
      actions: [
        {
          name: "Ping",
          command: async ({ host }) => {
            const { alive } = await testPing({ host });
            assert(alive, `cannot ping ${host}`);
          },
        },
        {
          name: "SSH",
          command: async ({ host }) => {
            await Promise.delay(3e3);
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        await Promise.delay(3e3);
        //console.log("onDestroyed");
      },
      actions: [
        {
          name: "Check Ping KO",
          command: async () => {
            await Promise.delay(3e3);
            //console.log("do ping");
          },
        },
      ],
    },
  };
};
