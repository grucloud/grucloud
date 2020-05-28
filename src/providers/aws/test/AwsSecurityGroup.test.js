const assert = require("assert");
const config = require("../config");
const AwsProvider = require("../AwsProvider");

describe("AwsSecurityGroup", async function () {
  let provider;
  let sg;

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    await provider.destroyAll();
    sg = provider.makeSecurityGroup({
      name: "sg",
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it("sg targets", async function () {
    const live = await sg.getLive();
    //assert(live);
    //assert.equal(live.KeyName, vpc.name);
  });
});
