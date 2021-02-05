const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");

module.exports = [
  {
    type: "EKSCluster",
    dependsOn: ["SecurityGroup", "Subnet"],
    Client: EKSCluster,
    isOurMinion: isOurMinionObject,
  },
];
