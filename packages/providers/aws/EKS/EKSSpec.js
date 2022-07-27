const assert = require("assert");
const { pipe, map, pick, omit, tap, not, get, eq } = require("rubico");
const { defaultsDeep, when, pluck, find } = require("rubico/x");

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
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            get("resourcesVpcConfig.subnetIds"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds:
            ({ lives, config }) =>
            (live) =>
              [
                get("resourcesVpcConfig.clusterSecurityGroupId")(live),
                ...get("resourcesVpcConfig.securityGroupIds")(live),
              ],
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => dependency,
                not(get("managedByOther")),
                tap((result) => {
                  assert(true);
                }),
              ])(),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("roleArn"),
        },
        key: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("SecurityGroups"),
        },
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
        cluster: {
          type: "Cluster",
          group: "EKS",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              (live) =>
                lives.getByName({
                  name: live.clusterName,
                  type: "Cluster",
                  group: "EKS",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("subnets"),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("nodeRole"),
        },
        launchTemplate: {
          type: "LaunchTemplate",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("launchTemplate.id"),
        },
        autoScaling: {
          type: "AutoScalingGroup",
          group: "AutoScaling",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("resources.autoScalingGroups"),
              pluck("name"),
              map((name) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "AutoScalingGroup",
                      group: "AutoScaling",
                      providerName: config.providerName,
                    }),
                  find(eq(get("live.AutoScalingGroupName"), name)),
                  get("id"),
                ])()
              ),
            ]),
        },
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
