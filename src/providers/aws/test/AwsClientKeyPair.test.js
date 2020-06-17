const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");

const AwsProvider = require("../AwsProvider");
//TODO renane in AwsKeyPair
describe("AwsClientKeyPair", async function () {
  let config;
  let provider;
  let keyPair;

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });
    await provider.destroyAll();
    keyPair = provider.makeKeyPair({
      name: "kp",
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("keyPair name", async function () {
    assert.equal(keyPair.name, "kp");
  });
  it("keyPair getLive", async function () {
    const live = await keyPair.getLive();
    assert.equal(live.KeyName, keyPair.name);
  });
});
