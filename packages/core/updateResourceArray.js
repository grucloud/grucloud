const assert = require("assert");
const { pipe, tap, get, map, filter, or } = require("rubico");
const { isDeepEqual } = require("rubico/x");

const Diff = require("diff");

const diffArrayOptions = {
  comparator: (left, right) => isDeepEqual(left, right),
};

exports.updateResourceArray =
  ({ endpoint, arrayPath, onAdd, onRemove }) =>
  async ({ payload, live, diff }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(arrayPath);
      }),
      () => diff,
      tap.if(
        or([
          get(`liveDiff.updated.${arrayPath}`),
          get(`targetDiff.added.${arrayPath}`),
          get(`liveDiff.added.${arrayPath}`),
        ]),
        pipe([
          () =>
            Diff.diffArrays(
              get(arrayPath, [])(live),
              get(arrayPath, [])(payload),
              diffArrayOptions
            ),
          tap((params) => {
            assert(true);
          }),
          (arrayDiff) =>
            pipe([
              () => arrayDiff,
              filter(get("removed")),
              map.series(
                pipe([get("value"), map.series(onRemove({ endpoint, live }))])
              ),
              () => arrayDiff,
              filter(get("added")),
              map.series(
                pipe([
                  get("value"),
                  map.series(onAdd({ endpoint, live, payload })),
                ])
              ),
            ])(),
        ])
      ),
      tap((params) => {
        assert(true);
      }),
    ])();
