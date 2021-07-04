const { pipe, assign, map } = require("rubico");

const {
  AwsAutoScalingGroup,
  autoScalingGroupIsOurMinion,
} = require("./AwsAutoScalingGroup");

const GROUP = "autoscaling";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "AutoScalingGroup",
      dependsOn: ["elb::LoadBalancer", "elb::TargetGroup", "eks::Cluster"],
      Client: AwsAutoScalingGroup,
      isOurMinion: autoScalingGroupIsOurMinion,
    },
  ]);
