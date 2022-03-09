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
} = require("rubico");
const { includes } = require("rubico/x");
const { compareAws, isOurMinion, DecodeUserData } = require("../AwsCommon");

const { omitIfEmpty } = require("@grucloud/core/Common");

const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");

const { AutoScalingAttachment } = require("./AutoScalingAttachment");

const compareAutoScaling = compareAws({});

const GROUP = "AutoScaling";

const filterTags = filter((tag) =>
  pipe([() => ["AmazonECSManaged"], not(includes(tag.Key))])()
);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
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
      compare: compareAutoScaling({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["TargetGroupARNs"]),
        ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
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
            ]),
            omitIfEmpty(["LoadBalancerNames"]),
            assign({ Tags: pipe([get("Tags"), filterTags]) }),
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      propertiesDefault: {
        HealthCheckType: "EC2",
        DefaultCooldown: 300,
        HealthCheckGracePeriod: 300,
      },
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
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ autoScalingGroup, targetGroup }) => {
            assert(autoScalingGroup);
            assert(targetGroup);
          }),
          ({ autoScalingGroup, targetGroup }) =>
            `attachment::${autoScalingGroup.name}::${targetGroup.name}`,
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
      compare: compareAutoScaling({
        filterLive: () =>
          pipe([
            omit([
              "LaunchConfigurationARN",
              "KeyName",
              "ClassicLinkVPCSecurityGroups",
              "KernelId",
              "RamdiskId",
              "CreatedTime",
            ]),
          ]),
      }),
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
  ]);
