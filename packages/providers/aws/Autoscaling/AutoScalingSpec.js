const {
  AwsAutoScalingGroup,
  autoScalingGroupIsOurMinion,
} = require("./AwsAutoScalingGroup");

module.exports = [
  {
    type: "AutoScalingGroup",
    dependsOn: ["LoadBalancer", "TargetGroup", "EC2", "EKSCluster"],
    Client: AwsAutoScalingGroup,
    isOurMinion: autoScalingGroupIsOurMinion,
    listOnly: true,
  },
];
