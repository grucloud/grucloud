const assert = require("assert");

module.exports = ({ resources, provider }) => {
  return {
    onDeployed: async () => {
      //console.log("s3 onDeployed");
    },
    onDestroyed: async () => {
      //console.log("s3 onDestroyed");
    },
  };
};
