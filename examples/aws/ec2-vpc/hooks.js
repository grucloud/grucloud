const assert = require("assert");

module.exports = ({
  resources: { vpc, ig, subnet, rt, sg, eip, server },
  provider,
}) => {
  return {
    onDeployed: {
      init: async () => {
        console.log("ec2-vpc onDeployed");
        //Check dependencies
        const sgLive = await sg.getLive();
        const igLive = await ig.getLive();
        const rtLive = await rt.getLive();
        const subnetLive = await subnet.getLive();
        const vpcLive = await vpc.getLive();
        const eipLive = await eip.getLive();
        const serverLive = await server.getLive();

        const serverInstance = serverLive.Instances[0];

        //Security Group
        assert.equal(sgLive.VpcId, vpcLive.VpcId);

        //Internet Gateway
        assert.equal(igLive.Attachments[0].VpcId, vpcLive.VpcId);

        //Route Tables
        assert.equal(rtLive.VpcId, vpcLive.VpcId);
        assert.equal(rtLive.Associations[0].SubnetId, subnetLive.SubnetId);

        // Subnet
        assert.equal(subnetLive.VpcId, vpcLive.VpcId);

        // Server
        assert.equal(serverInstance.VpcId, vpcLive.VpcId);

        //Check public ip address
        assert.equal(serverInstance.PublicIpAddress, eipLive.PublicIp);

        assert.equal(serverInstance.SecurityGroups[0].GroupId, sgLive.GroupId);
        return {};
      },
      actions: [
        {
          name: "Ping",
          command: async ({}) => {},
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
