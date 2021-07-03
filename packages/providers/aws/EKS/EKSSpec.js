const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("@grucloud/core/Common");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup, compareNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "eks";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "EKSCluster",
      dependsOn: ["SecurityGroup", "Subnet", "InternetGateway", "KmsKey"],
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
  ]);
