const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { Function } = require("./Function");

module.exports = [
  {
    type: "Function",
    dependsOn: ["IamRole"],
    Client: Function,
    isOurMinion,
    //TODO compare:
  },
];
