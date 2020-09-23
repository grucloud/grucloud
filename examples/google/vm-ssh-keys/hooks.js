const assert = require("assert");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

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

module.exports = ({ resources: { ip, server }, provider }) => {
  assert(provider);
  assert(ip);
  return {
    onDeployed: {
      init: async () => {
        const ipLive = await ip.getLive();
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
              retryCount: 40,
              retryDelay: 5e3,
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
