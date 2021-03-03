const assert = require("assert");
const Promise = require("bluebird");

module.exports = ({ resources }) => {
  return {
    name: "hooks extra",
    onDeployed: {
      init: async () => {
        //console.log("onDeployed");
        return {
          host: "www.google.com",
        };
      },
      actions: [
        {
          name: "Checks1",
          command: async ({ host }) => {
            await Promise.delay(500);
          },
        },
        {
          name: "Checks 2",
          command: async ({ host }) => {},
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        await Promise.delay(500);
      },
      actions: [
        {
          name: "Check Destroy 1",
          command: async () => {
            //throw Error("Bla Blas");
            //await Promise.delay(2e3);
          },
        },
      ],
    },
  };
};
