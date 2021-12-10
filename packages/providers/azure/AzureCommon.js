const assert = require("assert");
const { pipe, tap, get, assign, omit } = require("rubico");
const { identity, callProp } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { omitIfEmpty } = require("@grucloud/core/Common");

exports.buildTags = ({ managedByKey, managedByValue, stageTagKey, stage }) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.findDependenciesResourceGroup = ({ live, lives, config }) => ({
  type: "ResourceGroup",
  group: "resourceManagement",
  ids: [
    pipe([
      () => live,
      get("id"),
      callProp("split", "/"),
      callProp("slice", 0, 5),
      callProp("join", "/"),
      callProp("replace", "resourcegroups", "resourceGroups"),
      tap((params) => {
        assert(true);
      }),
    ])(),
  ],
});

const getStateName = (instance) => {
  const { provisioningState } = instance.properties;
  assert(provisioningState);
  //logger.debug(`az stateName ${provisioningState}`);
  return provisioningState;
};

const isInstanceUp = (instance) => {
  return ["Succeeded"].includes(getStateName(instance));
};
exports.isInstanceUp = isInstanceUp;

exports.compare = ({
  filterAll = identity,
  filterTarget = identity,
  filterLive = identity,
} = {}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      target: pipe([
        get("target", {}),
        //removeOurTagObject,
        filterTarget,
        filterAll,
      ]),
      live: pipe([
        get("live"), // removeOurTagObject,
        filterLive,
        filterAll,
      ]),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ target, live }) => ({
      targetDiff: pipe([
        () => detailedDiff(target, live),
        omit(["added"]),
        omitIfEmpty(["deleted", "updated" /*, "added"*/]),
        tap((params) => {
          assert(true);
        }),
      ])(),
      liveDiff: pipe([
        () => detailedDiff(live, target),
        omit(["deleted"]),
        omitIfEmpty(["added", "updated" /*, "deleted"*/]),
        tap((params) => {
          assert(true);
        }),
      ])(),
    }),
    tap((diff) => {
      assert(true);
    }),
  ]);
