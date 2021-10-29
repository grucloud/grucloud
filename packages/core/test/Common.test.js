const assert = require("assert");
const { isDeepEqual } = require("rubico/x");

const { differenceObject } = require("../Common");

describe.only("Common", function () {
  it("differenceObject 1", async function () {
    const result = differenceObject({ b: true })({ a: true });
    assert(
      isDeepEqual(result, {
        a: true,
      })
    );
  });
  it("differenceObject 2", async function () {
    const result = differenceObject({ a: false })({ a: true });
    assert(
      isDeepEqual(result, {
        a: true,
      })
    );
  });
  it("differenceObject 3", async function () {
    const result = differenceObject({ a: false })({ a: false });
    assert(isDeepEqual(result, {}));
  });
  it("differenceObject 4", async function () {
    const result = differenceObject({ a: { a1: 1 } })({
      a: { a2: 2 },
    });
    assert(isDeepEqual(result, { a: { a2: 2 } }));
  });
  it("differenceObject 5", async function () {
    const result = differenceObject({ a: { a1: 1 } })({
      a: { a1: 1 },
    });
    assert(isDeepEqual(result, {}));
  });
});
