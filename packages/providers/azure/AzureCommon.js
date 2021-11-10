const assert = require("assert");
const { pipe, tap, get, assign, omit } = require("rubico");
const { identity } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { omitIfEmpty, isUpByIdCore } = require("@grucloud/core/Common");
const filterTargetDefault = identity;
const filterLiveDefault = identity;

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

exports.isUpByIdFactory = ({ getById }) =>
  isUpByIdCore({
    isInstanceUp,
    getById,
  });

exports.compare = ({
  filterAll = identity,
  filterTarget = filterTargetDefault,
  filterLive = filterLiveDefault,
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
