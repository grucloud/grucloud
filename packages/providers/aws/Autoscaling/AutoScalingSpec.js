const { isOurMinion } = require("../AwsCommon");
const { AwsAutoScalingGroup } = require("./AwsAutoScalingGroup");

module.exports = [
  {
    type: "AutoScalingGroup",
    dependsOn: ["LoadBalancer", "TargetGroup", "EC2"],
    Client: AwsAutoScalingGroup,
    isOurMinion,
    listOnly: true,
  },
];
