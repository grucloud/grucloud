const { pipe, assign, map, pick, omit, tap } = require("rubico");
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
      compare: compare({
        fitterAll: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterTarget: omit([
          "resourcesVpcConfig.clusterSecurityGroupId",
          "resourcesVpcConfig.vpcId",
          "resourcesVpcConfig.subnetIds",
          "resourcesVpcConfig.publicAccessCidrs",
          "version",
          "encryptionConfig",
        ]),
        filterLive: omit([
          "arn",
          "encryptionConfig",
          "createdAt",
          "endpoint",
          "resourcesVpcConfig.clusterSecurityGroupId",
          "resourcesVpcConfig.vpcId",
          "resourcesVpcConfig.subnetIds",
          "resourcesVpcConfig.publicAccessCidrs",
          "kubernetesNetworkConfig",
          "identity",
          "logging",
          "status",
          "certificateAuthority",
          "clientRequestToken",
          "eks.2",
          "version",
          "platformVersion",
        ]),
      }),
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
