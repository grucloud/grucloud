const assert = require("assert");
const { pipe, tap, map, reduce, switchCase } = require("rubico");
const { isObject, identity } = require("rubico/x");

const deepReject = (predicate) =>
  pipe([
    tap((params) => {
      assert(predicate);
    }),
    switchCase([
      Array.isArray,
      pipe([map((obj) => deepReject(predicate)(obj))]),
      isObject,
      pipe([
        Object.entries,
        reduce(
          (acc, [key, value]) =>
            pipe([
              () => value,
              switchCase([
                Array.isArray,
                pipe([
                  map((obj) => deepReject(predicate)(obj)),
                  (result) => ({
                    ...acc,
                    [key]: result,
                  }),
                ]),
                isObject,
                pipe([
                  () => deepReject(predicate)(value),
                  (result) => ({
                    ...acc,
                    [key]: result,
                  }),
                ]),
                pipe([
                  switchCase([
                    () => predicate([key, value]),
                    () => acc,
                    () => ({ ...acc, [key]: value }),
                  ]),
                ]),
              ]),
            ])(),
          {}
        ),
      ]),
      identity,
    ]),
  ]);

exports.deepReject = deepReject;
