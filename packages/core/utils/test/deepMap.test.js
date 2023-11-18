const assert = require("assert");
const { pipe, tap } = require("rubico");
const { isDeepEqual, when } = require("rubico/x");

const { deepMap } = require("../deepMap");

describe("deepMap", function () {
  it("deepMap simple", async function () {
    const obj = {
      root: { a: "a", b: "b" },
    };
    const result = deepMap(
      pipe([
        when(
          ([key, value]) => key == "b",
          ([key, value]) => [key, "b1"]
        ),
      ])
    )(obj);
    assert(isDeepEqual(result, { root: { a: "a", b: "b1" } }));
  });
});
