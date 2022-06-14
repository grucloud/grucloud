const assert = require("assert");

const {
  cidrSubnetV6,
  cidrSubnetV4,
  ipToInt32,
  cidrsToNetworkNumber,
  cidrsToNewBits,
} = require("../ipUtils");

describe("ipUtils", function () {
  it("cidrSubnetV6", async function () {
    const cidrBlock = "2600:1f18:26dd:fe00::/56";
    const result = cidrSubnetV6({ subnetPrefix: "aa", prefixLength: "64" })(
      cidrBlock
    );
    assert.equal(result, "2600:1f18:26dd:feaa::/64");
  });
  it("ipToInt32", async function () {
    assert.equal(ipToInt32("192.168.1.0"), 3232235776);
  });
  it("cidrsToNewBits 1", async function () {
    assert.equal(
      cidrsToNewBits({ vpcCidr: "10.1.2.0/24", subnetCidr: "10.1.2.240/28" }),
      4
    );
  });
  it("cidrsToNewBits 2", async function () {
    assert.equal(
      cidrsToNewBits({ vpcCidr: "172.16.0.0/12", subnetCidr: "172.18.0.0/16" }),
      4
    );
  });
  it("cidrsToNetworkNumber 1", async function () {
    assert.equal(
      cidrsToNetworkNumber({
        vpcCidr: "10.1.2.0/24",
        subnetCidr: "10.1.2.240/28",
      }),
      15
    );
  });
  it("cidrsToNetworkNumber 2", async function () {
    assert.equal(
      cidrsToNetworkNumber({
        vpcCidr: "172.16.0.0/12",
        subnetCidr: "172.18.0.0/16",
      }),
      2
    );
  });
  it("cidrSubnet 1", async function () {
    assert.equal(
      cidrSubnetV4({ cidr: "10.1.2.0/24", newBits: 4, networkNumber: 15 }),
      "10.1.2.240/28"
    );
  });
  it("cidrSubnet 2", async function () {
    assert.equal(
      cidrSubnetV4({ cidr: "172.16.0.0/12", newBits: 4, networkNumber: 2 }),
      "172.18.0.0/16"
    );
  });
});
