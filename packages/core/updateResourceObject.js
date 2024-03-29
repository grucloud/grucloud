const assert = require("assert");
const { pipe, tap, get, switchCase, or } = require("rubico");
const { keys, includes } = require("rubico/x");

exports.updateResourceObject =
  ({ path, onAdded, onUpdated, onDeleted }) =>
  async ({ endpoint, payload, live, diff }) =>
    pipe([
      tap((params) => {
        // assert(endpoint);
        assert(path);
        assert(payload);
        assert(live);
      }),
      () => diff,
      switchCase([
        // Updated
        pipe([
          get(`liveDiff.updated`),
          keys,
          tap((params) => {
            assert(true);
          }),
          includes(path),
        ]),
        pipe([() => payload, onUpdated({ endpoint, live })]),
        // Added
        or([get(`liveDiff.added.${path}`)]),
        pipe([() => payload, onAdded({ endpoint, live })]),
        // Deleted
        or([get(`targetDiff.added.${path}`)]),
        pipe([() => payload, onDeleted({ endpoint, live })]),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();
