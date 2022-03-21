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
} = require("rubico");
const { includes, defaultsDeep } = require("rubico/x");
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
    tap((params) => {
      assert(true);
    }),
    get("Tags", []),
    filter(not(eq(get("Key"), "AmazonECSManaged"))),
    map(pick(["Key", "Value"])),
    tap((params) => {
      assert(true);
    }),
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
      //TODO dependsOn: ["ELBv2::LoadBalancer", "EKS::Cluster"],
      dependencies: {
        subnets: { type: "Subnet", group: "EC2", list: true },
        launchTemplate: { type: "LaunchTemplate", group: "EC2" },
        launchConfiguration: {
          type: "LaunchConfiguration",
          group: "AutoScaling",
        },
        serviceLinkedRole: {
          type: "Role",
          group: "IAM",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                tap(() => {
                  assert(resource);
                  assert(resource.live);
                }),
                () => resource,
                get("live.ServiceLinkedRoleARN"),
                not(includes("AWSServiceRoleForAutoScaling")),
              ])(),
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
      includeDefaultDependencies: true,
      inferName: ({
        properties,
        dependenciesSpec: { autoScalingGroup, targetGroup },
      }) =>
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
        },
        targetGroup: { type: "TargetGroup", group: "ELBv2" },
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
      ],
      compare: compareAutoScaling({}),
      // propertiesDefault: {
      //   EbsOptimized: false,
      //   BlockDeviceMappings: [],
      //   InstanceMonitoring: {
      //     Enabled: true,
      //   },
      // },
      filterLive: () =>
        pipe([
          pick([
            "InstanceType",
            "ImageId",
            "UserData",
            "InstanceMonitoring",
            "KernelId",
            "RamdiskId",
            "BlockDeviceMappings",
            "EbsOptimized",
            "AssociatePublicIpAddress",
          ]),
          omitIfEmpty(["KernelId", "RamdiskId"]),
          DecodeUserData,
        ]),
      dependencies: {
        instanceProfile: { type: "InstanceProfile", group: "IAM" },
        keyPair: { type: "KeyPair", group: "EC2" },
        image: { type: "Image", group: "EC2" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareAutoScaling({}) })),
]);
