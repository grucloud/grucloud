const assert = require("assert");
const { isDeepEqual } = require("rubico/x");

const { deepPick, deepPickByPath } = require("../deepPick");

describe("deepPick", function () {
  it("deepPick ok", async function () {
    const obj = { a: [{ b: 1, c: 2 }, { b: 2 }] };
    const expectedResult = { a: [{ b: 1 }, { b: 2 }] };
    const result = deepPick(["a[].b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepPick obj order", async function () {
    const obj = { name: "a", prop: "prop" };
    const result = deepPick(["name", "prop"])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepPick undefined", async function () {
    const obj = undefined;
    const expectedResult = undefined;
    const result = deepPick(["a[].b"])(obj);
    assert(result === expectedResult);
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
  it("deepPickByPath not in object", async function () {
    const obj = { a: 1 };
    const result = deepPickByPath(["b"])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepPickByPath with array not in object", async function () {
    const obj = { a: 1 };
    const result = deepPickByPath(["b[]"])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepPick empty paths", async function () {
    const obj = { a: 1 };
    const result = deepPick()(obj);
    assert(isDeepEqual(result, obj));
  });
});
