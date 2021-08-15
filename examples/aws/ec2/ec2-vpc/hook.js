const assert = require("assert");
const path = require("path");

const ping = require("ping");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

const readPrivateKey = () =>
  require("fs").readFileSync(path.resolve(__dirname, "kp-ec2-vpc.pem"));

const testSsh = async ({ host, username = "ec2-user" }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        //console.log(`ssh to ${host} ok`);
        conn.end();
        resolve();
      })
      .on("error", function (error) {
        //console.log(`cannot ssh to ${host}`, error);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        //agent: process.env.SSH_AUTH_SOCK,
        privateKey: readPrivateKey(),
      });
  });

module.exports = ({
  resources: { vpc, ig, subnet, routeTable, sg, eip, server },
  provider,
}) => {
  return {
    onDeployed: {
      init: async () => {
        //console.log("ec2-vpc onDeployed");
        //Check dependencies
        const serverLive = await server.getLive();

        return { host: serverLive.PublicIpAddress };
      },
      actions: [
        {
          name: "SSH",
          command: async ({ host }) => {
            assert(host);
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
      init: async () => {
        return {};
      },
      actions: [],
    },
  };
};
