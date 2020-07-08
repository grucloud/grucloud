const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpVpc", async function () {
  const vpcName = "vpc-test";
  let config;
  let provider;
  let vpc;
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await GoogleProvider({
      name: "google",
      config,
    });
    vpc = await provider.makeVpc({ name: vpcName });

    const { success } = await provider.destroyAll();
    assert(success);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("vpc config", async function () {
    const config = await vpc.resolveConfig();
    assert(config);
    assert.equal(config.name, vpcName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("lives", async function () {
    await provider.listLives();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("vpc apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
