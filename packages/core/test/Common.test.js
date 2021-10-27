const assert = require("assert");
const { isDeepEqual, keys, isObject } = require("rubico/x");
const { switchCase, tap, pipe, reduce } = require("rubico");

const differenceObject = (exclude) => (target) =>
  pipe([
    tap(() => {
      assert(target);
      assert(exclude);
    }),
    () => target,
    keys,
    reduce(
      (acc, key) =>
        pipe([
          switchCase([
            () => exclude.hasOwnProperty(key),
            switchCase([
              () => isObject(exclude[key]),
              pipe([
                () => differenceObject(exclude[key])(target[key]),
                (value) => ({ ...acc, [key]: value }),
              ]),
              () => acc,
            ]),
            () => ({ ...acc, [key]: target[key] }),
          ]),
        ])(),
      {}
    ),
  ])();

describe("Common", function () {
  it("differenceObject", async function () {
    assert(
      isDeepEqual(
        differenceObject({ a: { a1: 1 } })({ a: { a1: 1, a2: 2 }, b: 2 }),
        { a: { a2: 2 }, b: 2 }
      )
    );
  });
});
