const { isOurMinion } = require("../AwsCommon");
const { AwsAutoScalingGroup } = require("./AwsAutoScalingGroup");

module.exports = [
  {
    type: "AutoScalingGroup",
    dependsOn: ["LoadBalancer", "TargetGroup"],
    Client: AwsAutoScalingGroup,
    isOurMinion,
    listOnly: true,
  },
];
