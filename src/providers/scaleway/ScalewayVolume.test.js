const assert = require("assert");
const ScalewayProvider = require("./ScalewayProvider");
const config = require("./config");

describe("ScalewayVolume", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const volume = provider.makeVolume({ name: "volume1" }, () => ({
    size: 10000000000,
  }));

  after(async () => {
    await provider.destroyAll();
  });

  it("volume config", async function () {
    const config = await volume.config();
    assert(config);
  });

  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it.skip("deploy plan", async function () {
    await provider.listLives();
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
    await provider.deployPlan(plan);
    await provider.listLives();
    {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    }
    //console.log(JSON.stringify(plan, null, 4));
  });
});
