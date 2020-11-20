const assert = require("assert");
const { AzureProvider } = require("../AzureProvider");
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
      config = ConfigLoader({ path: "examples/azure" });
    } catch (error) {
      this.skip();
    }
    provider = AzureProvider({
      name: "azure",
      config,
    });
    rg = await provider.makeResourceGroup({ name: rgName });
  });
  after(async () => {});
  it("config", async function () {
    const config = await rg.resolveConfig();
    assert(config);
    assert.equal(config.location, provider.config().location);
  });
  it("lives", async function () {
    const { results: lives } = await provider.listLives();
    //console.log("lives ip", lives);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it.skip("az rg apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
