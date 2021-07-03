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
      type: "Cluster",
      dependsOn: ["SecurityGroup", "Subnet", "InternetGateway", "KmsKey"],
      Client: EKSCluster,
      isOurMinion,
    },
    {
      type: "NodeGroup",
      dependsOn: [
        "Cluster",
        "Subnet",
        "IamRole",
        "AutoScalingGroup",
        "Instance",
      ],
      Client: EKSNodeGroup,
      isOurMinion,
      compare: compareNodeGroup,
    },
  ]);
