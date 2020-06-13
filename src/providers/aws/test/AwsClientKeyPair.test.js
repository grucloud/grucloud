const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");

const AwsProvider = require("../AwsProvider");
//TODO renane in AwsKeyPair
describe("AwsClientKeyPair", async function () {
  let provider;
  let keyPair;

  before(async () => {
    provider = await AwsProvider({
      name: "aws",
      config: ConfigLoader({ baseDir: __dirname }),
    });
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
