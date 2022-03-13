const assert = require("assert");
const { pipe, assign, map, pick, omit, tap, not, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { isOurMinionObject } = require("../AwsCommon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "EKS";
const tagsKey = "tags";

const compareEKS = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Cluster",
      Client: EKSCluster,
      dependencies: {
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
      },
      propertiesDefault: {
        resourcesVpcConfig: {
          endpointPublicAccess: true,
          endpointPrivateAccess: false,
        },
      },
      omitProperties: [
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
      ],
      compare: compareEKS({}),
      filterLive: () => pick(["version"]),
    },
    {
      type: "NodeGroup",
      dependencies: {
        cluster: { type: "Cluster", group: "EKS", parent: true },
        subnets: { type: "Subnet", group: "EC2", list: true },
        role: { type: "Role", group: "IAM" },
        launchTemplate: { type: "LaunchTemplate", group: "EC2" },
        autoScaling: { type: "AutoScalingGroup", group: "AutoScaling" },
      },
      Client: EKSNodeGroup,

      compare: compareEKS({
        filterTarget: () =>
          pipe([
            pick([
              "amiType",
              "capacityType",
              "diskSize",
              "instanceTypes",
              "scalingConfig",
              "diskSize",
            ]),
          ]),
        filterLive: () =>
          pipe([
            pick([
              "amiType",
              "capacityType",
              "diskSize",
              "instanceTypes",
              "scalingConfig",
              "diskSize",
              "launchTemplate",
            ]),
            when(
              get("launchTemplate"),
              omit(["instanceTypes", "amiType", "diskSize"])
            ),
            omit(["launchTemplate"]),
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
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
