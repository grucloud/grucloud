const assert = require("assert");
const { isDeepEqual } = require("rubico/x");

const { deepOmitDefaults } = require("../deepOmitDefault");

describe("deepDefault", function () {
  it("deepDefault key already set", async function () {
    const obj = { a: 1, b: 2 };
    const result = deepOmitDefaults([["b", 2]])(obj);
    assert(isDeepEqual(result, { a: 1 }));
  });
});
