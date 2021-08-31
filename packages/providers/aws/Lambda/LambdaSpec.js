const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { Function, compareFunction } = require("./Function");
const { Layer, compareLayer } = require("./Layer");

const GROUP = "Lambda";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Layer",
      dependsOn: ["IAM::Role"],
      Client: Layer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareLayer,
    },
    {
      type: "Function",
      dependsOn: ["IAM::Role", "Lambda::Layer"],
      Client: Function,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareFunction,
    },
  ]);
