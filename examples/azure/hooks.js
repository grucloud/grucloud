const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: async () => {
      //console.log("azure onDeployed");
    },
    onDestroyed: async () => {
      //console.log("azure onDestroyed");
    },
  };
};
