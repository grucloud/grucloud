const assert = require("assert");
const { pipe, tap, map, switchCase } = require("rubico");
const { isObject, identity, callProp, isIn } = require("rubico/x");

const deepSortKey = (input = {}) =>
  pipe([
    switchCase([
      Array.isArray,
      pipe([map((obj) => deepSortKey(input)(obj))]),
      isObject,
      pipe([
        Object.entries,
        callProp("sort", (a, b) => a[0].localeCompare(b[0])),
        map(([key, value]) =>
          pipe([
            () => value,
            switchCase([
              () => isIn(input.keysExclude)(key),
              identity,
              Array.isArray,
              pipe([map((obj) => deepSortKey(input)(obj))]),
              isObject,
              pipe([(obj) => deepSortKey(input)(obj)]),
              identity,
            ]),
            (obj) => [key, obj],
          ])()
        ),
        Object.fromEntries,
      ]),
      identity,
    ]),
  ]);

exports.deepSortKey = deepSortKey;
