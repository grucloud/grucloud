const assert = require("assert");
const { pipe, assign, map, tap, filter, not, get, omit } = require("rubico");
const { includes } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");

const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");

const GROUP = "AutoScaling";

const filterTags = filter((tag) =>
  pipe([() => ["AmazonECSManaged"], not(includes(tag.Key))])()
);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "AutoScalingGroup",
      dependsOn: [
        "AutoScaling::LaunchConfiguration",
        "EC2::LaunchTemplate",
        "EC2::Subnet",
        "ELBv2::LoadBalancer",
        "ELBv2::TargetGroup",
        "EKS::Cluster",
      ],
      Client: AutoScalingAutoScalingGroup,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["Tags"]),
          omitIfEmpty(["TargetGroupARNs"]),
        ]),
        filterLive: pipe([
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
    },
    {
      type: "LaunchConfiguration",
      dependsOn: [
        "EC2::KeyPair",
        "EC2::SecurityGroup",
        "EC2::Subnet",
        "IAM::InstanceProfile",
      ],
      Client: AutoScalingLaunchConfiguration,
      isOurMinion: () => true,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
        filterLive: pipe([
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
    },
  ]);
