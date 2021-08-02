const assert = require("assert");
const path = require("path");
const { isDeepEqual } = require("rubico/x");

const { ConfigLoader } = require("../ConfigLoader");
const { envFromFile } = require("../EnvLoader");

const envFile = path.join(__dirname, "./test.env");

describe("ConfigLoader", async function () {
  it("envFromFile ", async function () {
    const [r1, r2, r3, r4, r5, r6] = envFromFile({ envFile });
    assert(isDeepEqual(r1, ["K1", "V1"]));
    assert(isDeepEqual(r2, ["K2", "V 2"]));
    assert(isDeepEqual(r3, ["K3", "V3"]));
    assert(isDeepEqual(r4, ["K4", "V4"]));
    assert(!r5);
    assert(!r6);
  });
  //TODO
  it.skip("no default.js", async function () {
    try {
      ConfigLoader({ baseDir: "./" });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.message, "Cannot open file config/default.js");
    }
  });
});
