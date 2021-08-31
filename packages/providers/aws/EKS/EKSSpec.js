const { pipe, assign, map, pick } = require("rubico");
const { compare } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup, compareNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "EKS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Cluster",
      dependsOn: [
        "EC2::SecurityGroup",
        "EC2::Subnet",
        "EC2::InternetGateway",
        "KMS::Key",
      ],
      Client: EKSCluster,
      isOurMinion,
    },
    {
      type: "NodeGroup",
      dependsOn: [
        "EKS::Cluster",
        "EC2::Subnet",
        "IAM::Role",
        "AutoScaling::AutoScalingGroup",
        "EC2::Instance",
      ],
      Client: EKSNodeGroup,
      isOurMinion,
      compare: compare({
        filterAll: pick([
          "amiType",
          "capacityType",
          "diskSize",
          "instanceTypes",
          "scalingConfig",
        ]),
      }),
    },
  ]);
