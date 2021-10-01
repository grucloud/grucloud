const assert = require("assert");
const { pipe, assign, map, omit, tap } = require("rubico");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");

const { Function, compareFunction } = require("./Function");
const { Layer, compareLayer } = require("./Layer");
const { EventSourceMapping } = require("./EventSourceMapping");
const { defaultsDeep } = require("rubico/x");

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
      displayResource: () => pipe([omit(["Content.Data", "Content.ZipFile"])]),
    },
    {
      type: "Function",
      dependsOn: ["IAM::Role", "Lambda::Layer"],
      Client: Function,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareFunction,
      displayResource: () => pipe([omit(["Code.Data", "Code.ZipFile"])]),
    },
    {
      type: "EventSourceMapping",
      dependsOn: ["Lambda::Function", "SQS::Queue"],
      Client: EventSourceMapping,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compare({
        filterTarget: pipe([
          defaultsDeep({
            BatchSize: 10,
            MaximumBatchingWindowInSeconds: 0,
          }),
          omit(["FunctionName", "Tags"]),
        ]),
        filterLive: pipe([
          omit([
            "UUID",
            "FunctionArn",
            "LastModified",
            "LastProcessingResult",
            "StateTransitionReason",
            "MaximumRecordAgeInSeconds",
            "Tags",
            "State",
          ]),
          omitIfEmpty([
            "StartingPosition",
            "StartingPositionTimestamp",
            "ParallelizationFactor",
            "BisectBatchOnFunctionError",
            "MaximumRetryAttempts",
            "TumblingWindowInSeconds",
          ]),
        ]), //TODO
      }),
    },
  ]);
