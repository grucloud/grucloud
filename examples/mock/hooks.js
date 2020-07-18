const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: async () => {
      //console.log("mock onDeployed");
    },
    onDestroyed: async () => {
      //console.log("mock onDestroyed");
    },
  };
};
