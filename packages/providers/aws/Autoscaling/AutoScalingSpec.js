const {
  AwsAutoScalingGroup,
  autoScalingGroupIsOurMinion,
} = require("./AwsAutoScalingGroup");

module.exports = [
  {
    type: "AutoScalingGroup",
    dependsOn: ["LoadBalancer", "TargetGroup", "EKSCluster"],
    Client: AwsAutoScalingGroup,
    isOurMinion: autoScalingGroupIsOurMinion,
  },
];
