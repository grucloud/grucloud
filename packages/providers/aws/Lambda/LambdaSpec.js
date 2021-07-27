const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { Function, compareFunction } = require("./Function");
const { Layer, compareLayer } = require("./Layer");

const GROUP = "lambda";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Layer",
      dependsOn: ["iam::Role"],
      Client: Layer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareLayer,
    },
    {
      type: "Function",
      dependsOn: ["iam::Role", "lambda::Layer"],
      Client: Function,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareFunction,
    },
  ]);
