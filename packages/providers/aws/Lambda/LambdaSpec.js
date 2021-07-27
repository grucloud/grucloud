const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { Function, compareFunction } = require("./Function");

const GROUP = "lambda";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Function",
      dependsOn: ["iam::Role"],
      Client: Function,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareFunction,
    },
  ]);
