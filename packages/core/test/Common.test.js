const assert = require("assert");
const { pipe, tap } = require("rubico");
const { isDeepEqual } = require("rubico/x");

const { differenceObject, flattenObject } = require("../Common");

describe("Common", function () {
  it("flattenObject", async function () {
    const result = flattenObject({
      filterKey: pipe([(key) => key === "c"]),
    })({
      a: true,
      b: { c: "toto" },
    });
    assert.equal(result[0], "toto");
  });

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
  it("differenceObject []", async function () {
    const result = differenceObject({ a: ["toto"] })({
      a: ["toto", "new"],
    });
    assert(isDeepEqual(result, { a: ["new"] }));
  });
});
