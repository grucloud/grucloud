const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

module.exports = [
  {
    type: "EKSCluster",
    dependsOn: ["SecurityGroup", "Subnet", "IamRole"],
    Client: EKSCluster,
    isOurMinion: isOurMinionObject,
  },
  {
    type: "EKSNodeGroup",
    dependsOn: ["EKSCluster", "Subnet", "IamRole"],
    Client: EKSNodeGroup,
    isOurMinion: isOurMinionObject,
  },
];
