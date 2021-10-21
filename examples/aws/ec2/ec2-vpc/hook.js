const assert = require("assert");
const path = require("path");
const { pipe, tap, get, eq, fork, or } = require("rubico");
const { find, first } = require("rubico/x");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

//TODO keyPairName variable
const readPrivateKey = () =>
  require("fs").readFileSync(path.resolve(__dirname, "kp-ec2-vpc.pem"));

const testSsh = ({ host, username = "ec2-user" }) =>
  new Promise((resolve, reject) => {
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

const getIpAddress = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["EC2::Instance"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "EC2::Instance")),
    get("resources"),
    first,
    get("live.PublicIpAddress"),
    tap((PublicIpAddress) => {
      assert(PublicIpAddress);
    }),
  ])();

module.exports = ({ provider }) => {
  return {
    onDeployed: {
      init: pipe([
        () => getIpAddress({ provider }),
        (PublicIpAddress) => ({ PublicIpAddress }),
      ]),
      actions: [
        {
          name: "SSH",
          command: async ({ PublicIpAddress }) => {
            assert(PublicIpAddress);
            await retryCall({
              name: `ssh ${PublicIpAddress}`,
              fn: async () => {
                await testSsh({ host: PublicIpAddress });
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
