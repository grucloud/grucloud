const assert = require("assert");
const { isEqual } = require("lodash/fp");
const path = require("path");
const { envFromFile } = require("../ConfigLoader");

const envFile = path.join(__dirname, "./test.env");

describe("ConfigLoader", async function () {
  it("envFromFile ", async function () {
    const [r1, r2, r3, r4, r5, r6] = envFromFile({ envFile });
    assert(isEqual(r1, ["K1", "V1"]));
    assert(isEqual(r2, ["K2", "V 2"]));
    assert(isEqual(r3, ["K3", "V3"]));
    assert(isEqual(r4, ["K4", "V4"]));
    assert(!r5);
    assert(!r6);
  });
});
