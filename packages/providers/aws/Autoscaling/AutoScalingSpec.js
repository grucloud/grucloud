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
      dependsOn: ["LoadBalancer", "TargetGroup", "EKSCluster"],
      Client: AwsAutoScalingGroup,
      isOurMinion: autoScalingGroupIsOurMinion,
    },
  ]);
