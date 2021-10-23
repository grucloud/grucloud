const assert = require("assert");
const { pipe, assign, map, pick, omit, tap, not, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { compare } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

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
        filterTarget: pipe([
          defaultsDeep({
            resourcesVpcConfig: {
              endpointPublicAccess: true,
              endpointPrivateAccess: false,
            },
          }),
          omit([
            "resourcesVpcConfig.clusterSecurityGroupId",
            "resourcesVpcConfig.vpcId",
            "resourcesVpcConfig.subnetIds",
            "resourcesVpcConfig.publicAccessCidrs",
            "version",
            "encryptionConfig",
          ]),
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
      filterLive: () => pick(["version"]),
      dependencies: () => ({
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                tap(() => {
                  assert(dependency);
                }),
                () => dependency,
                not(get("managedByOther")),
                tap((result) => {
                  assert(true);
                }),
              ])(),
        },
        role: { type: "Role", group: "IAM" },
        key: { type: "Key", group: "KMS" },
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
          "diskSize",
        ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "capacityType",
            "scalingConfig",
            "instanceTypes",
            "amiType",
            "labels",
            "diskSize",
            "launchTemplate",
          ]),
          when(
            get("launchTemplate"),
            omit(["instanceTypes", "amiType", "diskSize"])
          ),
          omit(["launchTemplate"]),
        ]),
      dependencies: () => ({
        cluster: { type: "Cluster", group: "EKS" },
        subnets: { type: "Subnet", group: "EC2", list: true },
        role: { type: "Role", group: "IAM" },
        launchTemplate: { type: "LaunchTemplate", group: "EC2" },
      }),
    },
  ]);
