const assert = require("assert");
const path = require("path");
const ping = require("ping");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 3,
  });

const testSsh = async ({ host, username = "ops", password }) =>
  await new Promise((resolve, reject) => {
    assert(password);
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
        //agent: process.env.SSH_AUTH_SOCK,
        //privateKey,
      });
  });

module.exports = ({ provider }) => {
  return {
    name: "azure hooks",
    onDeployed: {
      init: async () => {
        //console.log("azure onDeployed");
        const resources = provider.resources();
        const publicIpAddress = await resources.Network.PublicIPAddress[
          "rg-vm::ip-address"
        ].getLive();
        assert(publicIpAddress);
        const networkInterface = await resources.Network.NetworkInterface[
          "rg-vm::network-interface"
        ].getLive();
        assert(networkInterface);
        const vm = await resources.Compute.VirtualMachine[
          "rg-vm::vm"
        ].getLive();
        assert(vm, "vm not up");
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
            if (process.env.CONTINUOUS_INTEGRATION) {
              // cannot ping from circleci container
              return;
            }
            const alive = await retryCall({
              name: `ping ${host}`,
              fn: async () => {
                const { alive } = await testPing({ host });
                if (!alive) {
                  throw Error(`cannot ping ${host} yet`);
                }
                return alive;
              },
              shouldRetryOnException: () => true,
              config: { retryCount: 20, retryDelay: 2e3 },
            });
            assert(alive, `cannot ping ${host}`);
          },
        },
        {
          name: "SSH VM",
          command: async ({ host }) => {
            await retryCall({
              name: `ssh ${host}`,
              fn: async () => {
                await testSsh({
                  host,
                  username: process.env.RG_VM_VM_ADMIN_USERNAME,
                  password: process.env.RG_VM_VM_ADMIN_PASSWORD,
                });
              },
              isExpectedResult: () => true,
              shouldRetryOnException: () => true,
              config: { retryCount: 100, retryDelay: 5e3 },
            });
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
