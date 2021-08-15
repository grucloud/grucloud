const assert = require("assert");
const ping = require("ping");
const path = require("path");
const Client = require("ssh2").Client;

module.exports = ({ resources: { server }, provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        const serverLive = await server.getLive();
        assert(serverLive, "server should be alive");
        return {};
      },
      actions: [],
    },
    onDestroyed: {
      init: () => {},
    },
  };
};
