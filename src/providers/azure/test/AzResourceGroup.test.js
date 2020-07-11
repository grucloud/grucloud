const assert = require("assert");
const AzureProvider = require("../AzureProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("AzResourceGroup", async function () {
  let config;
  const rgName = "dev-resource-group";
  let provider;
  let rg;
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AzureProvider({
      name: "azure",
      config,
    });
    rg = await provider.makeResourceGroup({ name: rgName });

    const { success } = await provider.destroyAll();
    assert(success, "destroyAll ko");
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("config", async function () {
    const config = await rg.resolveConfig();
    assert(config);
    assert.equal(config.location, provider.config().location);
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
  it("az rg apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
