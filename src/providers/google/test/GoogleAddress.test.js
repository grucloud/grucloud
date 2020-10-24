const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GoogleAddress", async function () {
  const addressName = "myaddress-test";
  const types = ["Address"];
  let config;
  let provider;
  let address;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = await GoogleProvider({
      name: "google",
      config: config.google,
    });
    address = await provider.makeAddress({ name: addressName });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("address config", async function () {
    const config = await address.resolveConfig();
    assert(config);
    assert.equal(config.name, addressName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, types.length);
  });
  it("apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    await testPlanDestroy({ provider, types });
  });
});
