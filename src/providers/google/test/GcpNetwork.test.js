const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpNetwork", async function () {
  const networkName = "network-test";
  let config;
  let provider;
  let network;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      name: "google",
      config: config.google,
    });
    network = await provider.makeNetwork({ name: networkName });
  });
  after(async () => {});
  it("network config", async function () {
    const config = await network.resolveConfig();
    assert(config);
    assert.equal(config.name, networkName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it.skip("network apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
