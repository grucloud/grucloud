const { isOurMinion } = require("../AwsCommon");
const { AwsAutoScalingGroup } = require("./AwsAutoScalingGroup");

module.exports = [
  {
    type: "AutoScalingGroup",
    //dependsOn: [],
    Client: AwsAutoScalingGroup,
    isOurMinion,
    listOnly: true,
  },
];
