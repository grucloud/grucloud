const { isOurMinion } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");

module.exports = [
  {
    type: "EKSCluster",
    Client: EKSCluster,
    isOurMinion,
  },
];
