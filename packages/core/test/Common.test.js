const assert = require("assert");
const { pipe, tap } = require("rubico");
const { isDeepEqual } = require("rubico/x");

const {
  differenceObject,
  flattenObject,
  deepPick,
  deepPickByPath,
} = require("../Common");

describe("Common", function () {
  it("deepPick", async function () {
    const obj = { a: [{ b: 1, c: 2 }, { b: 2 }] };
    const expectedResult = { a: [{ b: 1 }, { b: 2 }] };
    const result = deepPick(["a[].b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepPick undefined", async function () {
    const obj = undefined;
    const expectedResult = undefined;
    const result = deepPick(["a[].b"])(obj);
    assert(expectedResult === undefined);
  });
  it("deepPick empty", async function () {
    const obj = { a: 1 };
    const expectedResult = {};
    const result = deepPick(["a.b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepPickByPath no deep no array", async function () {
    const obj = { a: 1, b: 2 };
    const expectedResult = { a: 1 };
    const result = deepPickByPath(["a"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepPickByPath deep no array", async function () {
    const obj = { a: { b: 2, c: 3 } };
    const expectedResult = { a: { b: 2 } };
    const result = deepPickByPath(["a", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepPickByPath with array", async function () {
    const obj = { a: [{ b: 1, c: 2 }, { b: 2 }] };
    const expectedResult = { a: [{ b: 1 }, { b: 2 }] };
    const result = deepPickByPath(["a[]", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
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
