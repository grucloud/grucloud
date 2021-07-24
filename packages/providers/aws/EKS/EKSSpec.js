const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup, compareNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "eks";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Cluster",
      dependsOn: [
        "ec2::SecurityGroup",
        "ec2::Subnet",
        "ec2::InternetGateway",
        "kms::Key",
      ],
      Client: EKSCluster,
      isOurMinion,
    },
    {
      type: "NodeGroup",
      dependsOn: [
        "eks::Cluster",
        "ec2::Subnet",
        "iam::Role",
        "autoscaling::AutoScalingGroup",
        "ec2::Instance",
      ],
      Client: EKSNodeGroup,
      isOurMinion,
      compare: compareNodeGroup,
    },
  ]);
