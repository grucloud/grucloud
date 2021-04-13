const assert = require("assert");

module.exports = ({ resources }) => {
  return {
    name: "mock",
    onDeployed: {
      init: async () => {
        const host = "www.google.com";
        return {
          host,
        };
      },
      actions: [
        {
          name: "Ping",
          command: async ({ host }) => {},
        },
      ],
    },
    onDestroyed: {
      init: async () => {},
      actions: [
        {
          name: "Check Ping KO",
          command: async () => {},
        },
      ],
    },
  };
};
