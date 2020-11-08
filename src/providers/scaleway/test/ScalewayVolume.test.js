const assert = require("assert");
const { ScalewayProvider } = require("../ScalewayProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("ScalewayVolume", async function () {
  let config;
  let provider;
  let volume;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = ScalewayProvider({
      name: "scaleway",
      config: config.scaleway,
    });
    volume = await provider.makeVolume({
      name: "volume1",
      config: () => ({
        size: 20_000_000_000,
      }),
    });
  });

  after(async () => {
    await provider?.destroyAll({ all: false });
  });

  it("volume config", async function () {
    const config = await volume.resolveConfig();
    assert(config.volume_type);
    assert(config.name);
  });

  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
