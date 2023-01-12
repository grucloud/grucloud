const assert = require("assert");
const {
  pipe,
  assign,
  map,
  tap,
  filter,
  not,
  get,
  omit,
  pick,
  eq,
  switchCase,
} = require("rubico");
const {
  includes,
  defaultsDeep,
  callProp,
  unless,
  isEmpty,
} = require("rubico/x");
const { compareAws, isOurMinion, DecodeUserData } = require("../AwsCommon");

const { omitIfEmpty } = require("@grucloud/core/Common");

const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");

const { AutoScalingAttachment } = require("./AutoScalingAttachment");

const compareAutoScaling = compareAws({
  getLiveTags: pipe([
    get("Tags", []),
    filter(not(eq(get("Key"), "AmazonECSManaged"))),
    map(pick(["Key", "Value"])),
  ]),
});

const GROUP = "AutoScaling";

const filterTags = filter((tag) =>
  pipe([() => ["AmazonECSManaged"], not(includes(tag.Key))])()
);

module.exports = pipe([
  () => [
    {
      type: "AutoScalingGroup",
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("VPCZoneIdentifier"), callProp("split", ",")]),
        },
        launchTemplate: {
          type: "LaunchTemplate",
          group: "EC2",
          dependencyIds:
            ({ lives, config }) =>
            (live) =>
              [
                pipe([() => live, get("LaunchTemplate.LaunchTemplateId")])(),
                pipe([
                  () => live,
                  get(
                    "MixedInstancesPolicy.LaunchTemplate.LaunchTemplateSpecification.LaunchTemplateId"
                  ),
                ])(),
              ],
        },
        launchConfiguration: {
          type: "LaunchConfiguration",
          group: "AutoScaling",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("LaunchConfigurationName"),
              lives.getByName({
                providerName: config.providerName,
                type: "LaunchConfiguration",
                group: "AutoScaling",
              }),
              get("id"),
            ]),
        },
        serviceLinkedRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            pipe([
              unless(
                includes("AWSServiceRoleForAutoScaling"),
                get("ServiceLinkedRoleARN")
              ),
            ]),
        },
      },
      Client: AutoScalingAutoScalingGroup,
      isOurMinion,
      omitProperties: [
        "AutoScalingGroupARN",
        "AvailabilityZones",
        "Instances",
        "CreatedTime",
        "SuspendedProcesses",
        "EnabledMetrics", //TODO
        "TerminationPolicies", //TODO
        "NewInstancesProtectedFromScaleIn", //TODO
        "LaunchTemplate.LaunchTemplateName",
        "TargetGroupARNs",
        "ServiceLinkedRoleARN",
      ],
      propertiesDefault: {
        HealthCheckType: "EC2",
        DefaultCooldown: 300,
        HealthCheckGracePeriod: 300,
      },
      compare: compareAutoScaling({
        filterLive: () =>
          pipe([
            omitIfEmpty(["LoadBalancerNames"]),
            assign({ Tags: pipe([get("Tags"), filterTags]) }),
          ]),
      }),
      filterLive: () =>
        pick([
          "MinSize",
          "MaxSize",
          "DesiredCapacity",
          "DefaultCooldown",
          "HealthCheckType",
          "HealthCheckGracePeriod",
        ]),
    },
    {
      type: "AutoScalingAttachment",
      Client: AutoScalingAttachment,
      isOurMinion: () => true,
      compare: compareAutoScaling({
        filterTarget: () => pipe([pick([])]),
        filterLive: () => pipe([pick([])]),
      }),
      inferName:
        ({ dependenciesSpec: { autoScalingGroup, targetGroup } }) =>
        () =>
          pipe([
            tap(() => {
              assert(autoScalingGroup);
              assert(targetGroup);
            }),
            () => `attachment::${autoScalingGroup}::${targetGroup}`,
          ])(),
      filterLive: () => pipe([pick([])]),
      dependencies: {
        autoScalingGroup: {
          type: "AutoScalingGroup",
          group: "AutoScaling",
          parent: true,
          dependencyId: ({ lives, config }) => get("AutoScalingGroupARN"),
        },
        targetGroup: {
          type: "TargetGroup",
          group: "ElasticLoadBalancingV2",
          dependencyId: ({ lives, config }) => get("TargetGroupARN"),
        },
      },
    },
    {
      type: "LaunchConfiguration",
      Client: AutoScalingLaunchConfiguration,
      isOurMinion: () => true,
      omitProperties: [
        "LaunchConfigurationARN",
        "KeyName",
        "ClassicLinkVPCSecurityGroups",
        "KernelId",
        "RamdiskId",
        "CreatedTime",
        "ImageId",
        "SecurityGroups",
        "IamInstanceProfile",
      ],
      compare: compareAutoScaling({
        filterLive: () => pipe([omit(["Image"])]),
      }),
      // propertiesDefault: {
      //   EbsOptimized: false,
      //   BlockDeviceMappings: [],
      //   InstanceMonitoring: {
      //     Enabled: true,
      //   },
      // },
      inferName: () => get("LaunchConfigurationName"),
      filterLive: () =>
        pipe([omitIfEmpty(["KernelId", "RamdiskId"]), DecodeUserData]),
      dependencies: {
        instanceProfile: {
          type: "InstanceProfile",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("IamInstanceProfile"),
              switchCase([
                isEmpty,
                () => undefined,
                callProp("startsWith", "arn"),
                pipe([
                  lives.getById({
                    type: "InstanceProfile",
                    group: "IAM",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ]),
                pipe([
                  lives.getByName({
                    type: "InstanceProfile",
                    group: "IAM",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ]),
              ]),
            ]),
        },
        keyPair: {
          type: "KeyPair",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("KeyName"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroups"),
        },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAutoScaling({}) })),
]);
