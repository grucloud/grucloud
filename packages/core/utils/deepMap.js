const assert = require("assert");
const { pipe, tap, map, switchCase } = require("rubico");
const { isObject, identity } = require("rubico/x");

const deepMap = (predicate) =>
  pipe([
    tap((params) => {
      assert(predicate);
    }),
    switchCase([
      Array.isArray,
      pipe([map((obj) => deepMap(predicate)(obj))]),
      isObject,
      pipe([
        Object.entries,
        map(([key, value]) =>
          pipe([
            () => value,
            switchCase([
              Array.isArray,
              pipe([
                map((obj) => deepMap(predicate)(obj)),
                (result) => [key, result],
              ]),
              isObject,
              pipe([
                (obj) => deepMap(predicate)(obj),
                (result) => [key, result],
              ]),
              predicate([key, value]),
            ]),
          ])()
        ),
        Object.fromEntries,
      ]),
      identity,
    ]),
  ]);

exports.deepMap = deepMap;
