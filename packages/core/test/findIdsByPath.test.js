const assert = require("assert");
const { findIdsByPath } = require("../Common");

const obj = {
  //
  a: { a1: 1 },
  b: [{ id: 2 }, { id: 3 }],
};

describe("findIdsByPath", function () {
  before(async function () {});
  it("findIdsByPath id", async function () {
    const result = findIdsByPath({ pathId: "a.a1" })(obj);
    assert.deepEqual(result, [1]);
  });
  it("findIdsByPath ids", async function () {
    const result = findIdsByPath({ pathId: "b[].id" })(obj);
    assert.deepEqual(result, [2, 3]);
  });
});
