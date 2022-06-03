const assert = require("assert");
const { isDeepEqual } = require("rubico/x");

const { deepOmit, deepOmitByPath } = require("../deepOmit");

describe("deepOmit", function () {
  it("deepOmit simple", async function () {
    const obj = { a: 1 };
    const result = deepOmit(["a"])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepOmit ok", async function () {
    const obj = { a: [{ b: 1, c: 2 }, { b: 2 }] };
    const expectedResult = { a: [{ c: 2 }, {}] };
    const result = deepOmit(["a[].b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepOmit all", async function () {
    const obj = { name: "a", prop: "prop" };
    const result = deepOmit(["name", "prop"])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepOmit undefined", async function () {
    const obj = undefined;
    const expectedResult = undefined;
    const result = deepOmit(["a[].b"])(obj);
    assert(result === expectedResult);
  });
  it("deepOmit empty", async function () {
    const obj = { a: 1 };
    const result = deepOmit(["a.b"])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepOmitByPath simple", async function () {
    const obj = { a: 1 };
    const result = deepOmitByPath(["a"])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepOmitByPath no deep no array", async function () {
    const obj = { a: 1, b: 2 };
    const expectedResult = { b: 2 };
    const result = deepOmitByPath(["a"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepOmitByPath deep no array 1", async function () {
    const obj = { a: { b: 2, c: 3 } };
    const expectedResult = { a: { c: 3 } };
    const result = deepOmitByPath(["a", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });

  it("deepOmitByPath deep no array 2", async function () {
    const obj = { a: { b: 2, c: 3 }, b: 2 };
    const expectedResult = { a: { c: 3 }, b: 2 };
    const result = deepOmitByPath(["a", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepOmitByPath deep no array, remove undefined", async function () {
    const obj = { a: { b: 2 }, c: 1 };
    const expectedResult = { a: {}, c: 1 };
    const result = deepOmitByPath(["a", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepOmitByPath with array", async function () {
    const obj = { a: [{ b: 1, c: 2 }, { b: 2 }] };
    const expectedResult = { a: [{ c: 2 }, {}] };
    const result = deepOmitByPath(["a[]", "b"])(obj);
    assert(isDeepEqual(result, expectedResult));
  });
  it("deepOmitByPath not in object", async function () {
    const obj = { a: 1 };
    const result = deepOmitByPath(["b"])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepOmitByPath with array not in object", async function () {
    const obj = { a: 1 };
    const result = deepOmitByPath(["b[]"])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepOmitByPath with array deep", async function () {
    const obj = {};
    const result = deepOmitByPath(["a", "b[]", "c"])(obj);
    assert(isDeepEqual(result, obj));
  });
  it("deepOmitByPath empty all array", async function () {
    const obj = { a: [{ b: 2 }], c: 3 };
    const result = deepOmitByPath(["a[]", "b"])(obj);
    assert(isDeepEqual(result, { a: [{}], c: 3 }));
  });
  it("deepOmitByPath BillingModeSummary", async function () {
    const obj = {
      a: 1,
    };
    const result = deepOmit(["b.c"])(obj);
    assert(isDeepEqual(result, { a: 1 }));
  });
  it("deepOmit path contains array, no omit", async function () {
    const obj = {
      a: 1,
    };
    const result = deepOmit([["b", "c"]])(obj);
    assert(isDeepEqual(result, { a: 1 }));
  });
  it("deepOmit path contains array deep", async function () {
    const obj = {
      "deployment.kubernetes.io/revision": "1",
    };
    const result = deepOmit([["deployment.kubernetes.io/revision"]])(obj);
    assert(isDeepEqual(result, {}));
  });
  it("deepOmit path contains array", async function () {
    const obj = {
      b: { c: 1 },
    };
    const result = deepOmit([["b", "c"]])(obj);
    assert(isDeepEqual(result, { b: {} }));
  });

  it("deepOmitByPath paths undefined", async function () {
    const obj = {
      a: 1,
    };
    const result = deepOmit()(obj);
    assert(isDeepEqual(result, obj));
  });
});
