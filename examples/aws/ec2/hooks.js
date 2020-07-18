const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

const testSsh = async ({ host, username = "ubuntu" }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        console.log(`ssh to ${host} ok`);
        resolve();
      })
      .on("error", function (error) {
        console.log(`cannot ssh to ${host}`);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        agent: process.env.SSH_AUTH_SOCK,
        //privateKey: require("fs").readFileSync("/here/is/my/key"),
      });
  });

module.exports = ({ resources: { eip, server }, provider }) => {
  return {
    onDeployed: async () => {
      console.log("ec2 onDeployed");

      const eipLive = await eip.getLive();
      const serverLive = await server.getLive();

      const serverInstance = serverLive.Instances[0];
      assert.equal(serverInstance.PublicIpAddress, eipLive.PublicIp);
      const host = eipLive.PublicIp;
      // Ping
      const { alive } = await testPing({ host });
      console.log(`Ping ${host} alive: ${alive}`);
      assert(alive, `cannot ping ${host}`);

      // SSH
      await testSsh({ host });
    },
    onDestroyed: async () => {
      console.log("ec2 onDestroyed");
    },
  };
};
