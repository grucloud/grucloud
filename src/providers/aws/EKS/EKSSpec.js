const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

module.exports = [
  {
    type: "EKSCluster",
    dependsOn: ["SecurityGroup", "Subnet"],
    Client: EKSCluster,
    isOurMinion: isOurMinionObject,
  },
  {
    type: "EKSNodeGroup",
    dependsOn: ["EKSCluster"],
    Client: EKSNodeGroup,
    isOurMinion: isOurMinionObject,
  },
];
