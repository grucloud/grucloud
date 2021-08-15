const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AwsKeyPair", async function () {
  let config;
  let provider;
  let keyPair;
  let keyPairKo;
  const types = ["KeyPair"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
  });
  after(async () => {});
  it.skip("keyPair create", async function () {
    const keyPair = provider.ec2.makeKeyPair({
      name: "kp-test",
    });
    try {
      await provider.start();

      await testPlanDeploy({ provider, types });
      await testPlanDestroy({ provider, types });
    } catch (error) {
      throw error;
    }
  });
  it.skip("keyPair name not found on server", async function () {
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
