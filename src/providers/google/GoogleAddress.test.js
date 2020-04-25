const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");
const config = require("./config");

describe.skip("GoogleAddress", function () {
  const provider = GoogleProvider({ name: "google" }, config);
  const address = provider.makeAddress({ name: "myip" });

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

  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("deploy plan", async function () {
    await provider.listLives();
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
    await provider.deployPlan(plan);

    {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    }
    const live = await address.getLive();
    assert(live);
    assert(live.id);
  });
});
