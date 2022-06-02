const assert = require("assert");

const { cidrSubnet } = require("../ipUtils");

describe("ipUtils", function () {
  it("cidrSubnet", async function () {
    const cidrBlock = "2600:1f18:26dd:fe00::/56";
    const result = cidrSubnet({ subnetPrefix: "aa", prefixLength: "64" })(
      cidrBlock
    );
    assert.equal(result, "2600:1f18:26dd:feaa::/64");
  });
});
