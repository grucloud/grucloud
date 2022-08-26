const assert = require("assert");
const { pipe, tap, filter, or, switchCase, not, map, gte } = require("rubico");
const {
  isEmpty,
  flatten,
  values,
  isObject,
  unless,
  append,
  keys,
  size,
  callProp,
} = require("rubico/x");

const buildParentPath = (key) =>
  pipe([
    unless(or([() => isEmpty(key), () => key === "resources"]), append(key)),
  ]);

const getResourcesDeep =
  ({ parentPath = [], accumulator = [] } = {}) =>
  (properties = {}) =>
    pipe([
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          switchCase([
            () => key === "methods",
            pipe([
              keys,
              switchCase([
                gte(size, 2),
                pipe([
                  () => parentPath,
                  callProp("join", "."),
                  (typeFull) => [{ typeFull, methods: obj }],
                ]),
                () => [],
              ]),
            ]),
            Array.isArray,
            () => [],
            isObject,
            getResourcesDeep({ parentPath: buildParentPath(key)(parentPath) }),
            // Default
            () => [],
          ]),
        ])(),
      ]),
      values,
      filter(not(isEmpty)),
      flatten,
      (results) => [...accumulator, ...results],
    ])();

exports.getResourcesDeep = getResourcesDeep;
