const assert = require("assert");
const config = require("../config");
const AwsProvider = require("../AwsProvider");
//TODO renane in AwsKeyPair
describe("AwsClientKeyPair", async function () {
  let provider;
  let keyPair;

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    await provider.destroyAll();
    keyPair = provider.makeKeyPair({
      name: "kp",
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("keyPair name", async function () {
    assert.equal(keyPair.name, "kp");
  });
  it("keyPair getLive", async function () {
    const live = await keyPair.getLive();
    assert.equal(live.KeyName, keyPair.name);
  });
});
