const assert = require("assert");
const { pipe, tap, map, reduce, switchCase } = require("rubico");
const { isObject, identity, callProp } = require("rubico/x");

const deepSortKey = pipe([
  switchCase([
    Array.isArray,
    pipe([map((obj) => deepSortKey(obj))]),
    isObject,
    pipe([
      Object.entries,
      callProp("sort", (a, b) => a[0].localeCompare(b[0])),
      Object.fromEntries,
      map(
        switchCase([
          Array.isArray,
          map((obj) => deepSortKey(obj)),
          isObject,
          (obj) => deepSortKey(obj),
          identity,
        ])
      ),
    ]),
    identity,
  ]),
]);

exports.deepSortKey = deepSortKey;
