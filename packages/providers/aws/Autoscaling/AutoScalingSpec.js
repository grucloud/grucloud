const assert = require("assert");
const { pipe, assign, map, tap, filter, not, get } = require("rubico");
const { includes } = require("rubico/x");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const {
  AutoScalingAutoScalingGroup,
} = require("./AutoScalingAutoScalingGroup");
const {
  AutoScalingLaunchConfiguration,
} = require("./AutoScalingLaunchConfiguration");

const GROUP = "autoscaling";

const filterTags = filter((tag) =>
  pipe([() => ["AmazonECSManaged"], not(includes(tag.Key))])()
);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "AutoScalingGroup",
      dependsOn: [
        "autoscaling::LaunchConfiguration",
        "ec2::LaunchTemplate",
        "ec2::Subnet",
        "elb::LoadBalancer",
        "elb::TargetGroup",
        "eks::Cluster",
      ],
      Client: AutoScalingAutoScalingGroup,
      isOurMinion,
      compare: compare({
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
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
        "ec2::KeyPair",
        "ec2::SecurityGroup",
        "ec2::Subnet",
        "iam::InstanceProfile",
        "ec2::Volume",
      ],
      Client: AutoScalingLaunchConfiguration,
      isOurMinion: () => true,
    },
  ]);
