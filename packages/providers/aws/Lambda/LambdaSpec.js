const { pipe, assign, map } = require("rubico");
const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { Function } = require("./Function");

const GROUP = "lambda";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Function",
      dependsOn: ["IamRole"],
      Client: Function,
      isOurMinion,
      //TODO compare:
    },
  ]);
