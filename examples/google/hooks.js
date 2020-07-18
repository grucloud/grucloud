const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: async () => {
      //console.log("google onDeployed");
    },
    onDestroyed: async () => {
      //console.log("google onDestroyed");
    },
  };
};
