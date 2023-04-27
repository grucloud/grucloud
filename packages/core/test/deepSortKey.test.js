const assert = require("assert");
const { isDeepEqual, isEmpty } = require("rubico/x");

const { deepSortKey } = require("../deepSortKey");

describe("deepSortKey", function () {
  it("deepSortKey simple", async function () {
    const obj = {
      c: 3,
      b: [{ z: 1, y: 2 }],
      a: { z: 1, y: 2 },
    };
    const result = deepSortKey(obj);
    assert(
      isDeepEqual(result, {
        a: { y: 2, z: 1 },
        b: [{ y: 2, z: 1 }],
        c: 3,
      })
    );
  });
});
