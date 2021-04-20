const { isOurMinionObject } = require("@grucloud/core/Common");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup, compareNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = [
  {
    type: "EKSCluster",
    dependsOn: ["SecurityGroup", "Subnet", "InternetGateway"],
    Client: EKSCluster,
    isOurMinion,
  },
  {
    type: "EKSNodeGroup",
    dependsOn: ["EKSCluster", "Subnet", "IamRole", "AutoScalingGroup", "EC2"],
    Client: EKSNodeGroup,
    isOurMinion,
    compare: compareNodeGroup,
  },
];
