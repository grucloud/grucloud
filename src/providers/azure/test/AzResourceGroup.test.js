const assert = require("assert");
const AzureProvider = require("../AzureProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe.skip("AzResourceGroup", async function () {
  const rgName = "dev-resource-group";
  let provider;
  let rg;
  before(async function () {
    try {
      provider = await AzureProvider({
        name: "azure",
        config: ConfigLoader({ baseDir: __dirname }),
      });
      rg = provider.makeResourceGroup({ name: rgName });
      await provider.destroyAll();
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("config", async function () {
    const config = await rg.resolveConfig();
    assert(config);
    assert.equal(config.location, provider.config.location);
  });
  it("lives", async function () {
    const lives = await provider.listLives();
    //console.log("lives ip", lives);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
