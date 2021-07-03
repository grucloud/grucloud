const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");

describe("AwsKeyPair", async function () {
  let config;
  let provider;
  let keyPair;
  let keyPairKo;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    keyPair = provider.ec2.useKeyPair({
      name: "kp",
    });
  });
  after(async () => {});
  it("keyPair name", async function () {
    assert.equal(keyPair.name, "kp");
  });
  it.skip("keyPair getLive", async function () {
    const live = await keyPair.getLive();
    assert.equal(live.KeyName, keyPair.name);
  });

  it("keyPair name not found on server", async function () {
    provider.ec2.useKeyPair({
      name: "idonotexist",
    });
    try {
      await provider.start();
      assert(false, "should not be here");
    } catch (ex) {
      assert(ex[0].error);
    }
  });
});
