const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");
const config = require("./config");
const { testProviderLifeCycle } = require("../../test/E2ETestUtils");

describe("GoogleAddress", async function () {
  const provider = await GoogleProvider({ name: "google" }, config);
  const address = provider.makeAddress({ name: "test" });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("address config", async function () {
    const config = await address.config();
    assert(config);
  });
  it("lives", async function () {
    const lives = await provider.listLives();
    console.log("lives ip", lives);
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
