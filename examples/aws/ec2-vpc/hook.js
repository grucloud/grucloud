const assert = require("assert");

const ping = require("ping");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

//const privateKey = require("fs").readFileSync(
//  path.resolve(__dirname, "../../../secrets/kp.pem")
//);

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

module.exports = ({
  resources: { vpc, ig, subnet, routeTable, sg, eip, server },
  provider,
}) => {
  return {
    onDeployed: {
      init: async () => {
        //console.log("ec2-vpc onDeployed");
        //Check dependencies

        const sgLive = await sg.getLive();
        const igLive = await ig.getLive();
        const rtLive = await routeTable.getLive();
        const subnetLive = await subnet.getLive();
        const vpcLive = await vpc.getLive();
        const eipLive = await eip.getLive();
        const serverLive = await server.getLive();

        //Security Group
        assert.equal(sgLive.VpcId, vpcLive.VpcId);

        //Internet Gateway
        assert.equal(igLive.Attachments[0].VpcId, vpcLive.VpcId);

        //Route Tables
        assert.equal(rtLive.VpcId, vpcLive.VpcId);
        // assert.equal(
        //   rtLive.Associations[0].GatewayId,
        //   igLive.InternetGatewayId
        // );

        // Subnet
        assert.equal(subnetLive.VpcId, vpcLive.VpcId);

        // Server
        assert.equal(serverLive.VpcId, vpcLive.VpcId);

        //Check public ip address
        assert.equal(serverLive.PublicIpAddress, eipLive.PublicIp);

        assert.equal(serverLive.SecurityGroups[0].GroupId, sgLive.GroupId);
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
