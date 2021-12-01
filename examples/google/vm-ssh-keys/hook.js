const assert = require("assert");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

// TODO create privateKey
const testSsh = async ({ host, username = "ubuntu" }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        conn.end();
        resolve();
      })
      .on("error", function (error) {
        // console.log(`cannot ssh to ${host}`, error);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        agent: process.env.SSH_AUTH_SOCK,
        //privateKey,
      });
  });

module.exports = ({ provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        const resources = provider.resources();
        assert(resources);
        const ipLive = await resources.compute.Address[
          "ip-webserver-ssh-keys"
        ].getLive();
        assert(ipLive);
        const host = ipLive.address;
        return {
          host,
        };
      },
      actions: [
        {
          name: "SSH",
          command: async ({ host }) => {
            await retryCall({
              name: `ssh ${host}`,
              fn: async () => {
                await testSsh({ host });
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
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
