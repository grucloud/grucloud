const assert = require("assert");

module.exports = ({ resources }) => {
  const { ip, server } = resources;
  return {
    onDeployed: async () => {
      console.log("ip.getLive");
      try {
        console.log("ip.getLive, ", await ip.getLive());
      } catch (error) {
        console.error(error);
      }
      //console.log("mock onDeployed, ", resources);
    },
    onDestroyed: async () => {
      console.log("mock onDestroyed");
    },
  };
};
