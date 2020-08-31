const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpVpc", async function () {
  const networkName = "network-test";
  let config;
  let provider;
  let network;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/google/vm" });
    } catch (error) {
      this.skip();
    }
    provider = await GoogleProvider({
      name: "google",
      config,
    });
    network = await provider.makeNetwork({ name: networkName });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("network config", async function () {
    const config = await network.resolveConfig();
    assert(config);
    assert.equal(config.name, networkName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("lives", async function () {
    await provider.listLives();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it.skip("network apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
