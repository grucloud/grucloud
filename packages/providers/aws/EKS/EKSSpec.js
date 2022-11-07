const { replaceWithName } = require("@grucloud/core/Common");
const assert = require("assert");
const { pipe, map, pick, omit, tap, not, get, eq, assign } = require("rubico");
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

const omitLaunchTemplateProps = pipe([
  when(get("launchTemplate"), omit(["instanceTypes", "amiType", "diskSize"])),
  omit(["launchTemplate"]),
]);

module.exports = pipe([
  () => [
    {
      type: "Cluster",
      inferName: pipe([
        get("properties.name"),
        tap((name) => {
          assert(name);
        }),
      ]),
      Client: EKSCluster,
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("resourcesVpcConfig.subnetIds")]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("resourcesVpcConfig.securityGroupIds")]),
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => dependency,
                get("live.Tags"),
                not(find(eq(get("Key"), "aws:eks:cluster-name"))),
              ])(),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("roleArn"),
        },
        kmsKeys: {
          type: "Key",
          group: "KMS",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("encryptionConfig"), pluck("provider.keyArn")]),
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
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          pick(["name", "version", "encryptionConfig"]),
          when(
            get("encryptionConfig"),
            assign({
              encryptionConfig: pipe([
                get("encryptionConfig"),
                map(
                  assign({
                    provider: pipe([
                      get("provider"),
                      assign({
                        keyArn: pipe([
                          get("keyArn"),
                          replaceWithName({
                            groupType: "KMS::Key",
                            path: "id",
                            providerConfig,
                            lives,
                          }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
    },
    {
      type: "NodeGroup",
      inferName: get("properties.nodegroupName"),
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
            omitLaunchTemplateProps,
          ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "nodegroupName",
            "capacityType",
            "scalingConfig",
            "instanceTypes",
            "amiType",
            "labels",
            "diskSize",
            "launchTemplate",
          ]),
          omitLaunchTemplateProps,
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
