const assert = require("assert");

module.exports = ({ resources: { eip, server }, provider }) => {
  return {
    onDeployed: async () => {
      //console.log("ec2 onDeployed");

      //Check dependencies
      const eipLive = await eip.getLive();
      const serverLive = await server.getLive();

      const serverInstance = serverLive.Instances[0];
      // Server
      //assert.equal(serverInstance.VpcId, vpcLive.VpcId);
      assert.equal(serverInstance.PublicIpAddress, eipLive.PublicIp);
    },
    onDestroyed: async () => {
      //console.log("ec2 onDestroyed");
    },
  };
};
