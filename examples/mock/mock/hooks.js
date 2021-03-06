const assert = require("assert");
const ping = require("ping");
const Promise = require("bluebird");

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

module.exports = ({ resources }) => {
  return {
    name: "mock",
    onDeployed: {
      init: async () => {
        //console.log("onDeployed");
        const host = "www.google.com";
        //throw Error("throw in hook init");
        await Promise.delay(100);
        return {
          host,
        };
      },
      actions: [
        {
          name: "Ping",
          command: async ({ host }) => {
            //const { alive } = await testPing({ host });
            //assert(alive, `cannot ping ${host}`);
            await Promise.delay(100);
          },
        },
        {
          name: "SSH",
          command: async ({ host }) => {
            //throw Error("SSSSSSSSSS");
            await Promise.delay(100);
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        //throw Error("throw in onDestroyed hook init");
        await Promise.delay(200);
        //console.log("onDestroyed");
      },
      actions: [
        {
          name: "Check Ping KO",
          command: async () => {
            //throw Error("SSSSSSSSSS");
            await Promise.delay(200);
            //console.log("do ping");
          },
        },
      ],
    },
  };
};
