const assert = require("assert");
const { isDeepEqual, isEmpty } = require("rubico/x");

const { deepReject } = require("../deepReject");

describe("deepReject", function () {
  it("deepReject simple", async function () {
    const obj = {
      a: 1,
      b: null,
      c: { a: 2, b: null },
      d: undefined,
      e: [null, { a: 1, b: null }],
    };
    const result = deepReject(([key, value]) => isEmpty(value))(obj);
    assert(isDeepEqual(result, { a: 1, c: { a: 2 }, e: [null, { a: 1 }] }));
  });
});
