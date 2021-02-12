const { isOurMinionObject } = require("../../Common");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ resource, config }) =>
  isOurMinionObject({ tags: resource.tags, config });

module.exports = [
  {
    type: "EKSCluster",
    dependsOn: ["SecurityGroup", "Subnet", "IamRole"],
    Client: EKSCluster,
    isOurMinion,
  },
  {
    type: "EKSNodeGroup",
    dependsOn: ["EKSCluster", "Subnet", "IamRole"],
    Client: EKSNodeGroup,
    isOurMinion,
  },
];
