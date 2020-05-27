const assert = require("assert");
const config = require("../config");
const AwsProvider = require("../AwsProvider");

describe("AwsVpc", async function () {
  let provider;
  let vpc;

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    await provider.destroyAll();
    vpc = provider.makeVpc({
      name: "vpc",
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("vpc name", async function () {
    assert.equal(vpc.name, "vpc");
  });
  it("vpc targets", async function () {
    const live = await vpc.getLive();
    //assert(live);
    //assert.equal(live.KeyName, vpc.name);
  });
});
