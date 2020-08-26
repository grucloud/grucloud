const assert = require("assert");
const ping = require("ping");
const Client = require("ssh2").Client;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 3,
  });

const testSsh = async ({ host, username = "ubuntu", password }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        //console.log(`ssh to ${host} ok`);
        conn.end();
        resolve();
      })
      .on("error", function (error) {
        //console.log(`cannot ssh to ${host}`);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        password,
        agent: process.env.SSH_AUTH_SOCK,
        //privateKey: require("fs").readFileSync("/here/is/my/key"),
      });
  });

module.exports = ({ resources, config }) => {
  return {
    name: "azure hooks",
    onDeployed: {
      init: async () => {
        //console.log("azure onDeployed");
        const publicIpAddress = await resources.publicIpAddress.getLive();
        const networkInterface = await resources.networkInterface.getLive();
        const vm = await resources.vm.getLive();

        //Check network interface id of the vm
        assert.equal(
          vm.properties.networkProfile.networkInterfaces[0].id,
          networkInterface.id
        );

        // Check ipconfiguration between the publicIpAddress and the networkInterface
        assert.equal(
          publicIpAddress.properties.ipConfiguration.id,
          networkInterface.properties.ipConfigurations[0].id
        );
        //      assert.equal(serverInstance.PublicIpAddress, eipLive.PublicIp);
        const host = publicIpAddress.properties.ipAddress;

        return { host };
      },
      actions: [
        {
          name: "Ping VM",
          command: async ({ host }) => {
            //console.log(`Pinging ${host}`);
            //TODO
            //const { alive } = await testPing({ host });
            //assert(alive, `Cannot ping ${host}`);
            //console.log(`Ping ${host} alive: ${alive}`);
          },
        },
        {
          name: "SSH VM",
          command: async ({ host }) => {
            /*await testSsh({
              host,
              username: process.env.MACHINE_ADMIN_USERNAME,
              password: process.env.MACHINE_ADMIN_PASSWORD,
            });*/
          },
        },
      ],
    },
    onDestroyed: {
      init: async () => {
        return {};
      },
      actions: [
        {
          name: "Perform check",
          command: async ({}) => {},
        },
      ],
    },
  };
};
