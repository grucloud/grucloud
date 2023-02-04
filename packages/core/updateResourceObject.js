const assert = require("assert");
const { pipe, tap, get, switchCase, or } = require("rubico");

exports.updateResourceObject =
  ({ path, onAdded, onUpdated, onDeleted }) =>
  async ({ endpoint, payload, live, diff }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(path);
        assert(payload);
        assert(live);
      }),
      () => diff,
      switchCase([
        // Added
        or([get(`liveDiff.added.${path}`)]),
        pipe([() => payload, onAdded({ endpoint, live })]),
        // Updated
        or([get(`liveDiff.updated.${path}`)]),
        pipe([() => payload, onUpdated({ endpoint, live })]),
        // Deleted
        or([get(`targetDiff.added.${path}`)]),
        pipe([() => payload, onDeleted({ endpoint, live })]),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();
