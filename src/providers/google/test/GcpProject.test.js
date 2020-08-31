const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe.skip("GcpProject", async function () {
  const projectName = "project-test";
  let config;
  let provider;
  let project;
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
    project = await provider.makeProject({ name: projectName });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("project config", async function () {
    const config = await project.resolveConfig();
    assert(config);
    assert.equal(config.name, projectName);
    assert.equal(
      config.labels[provider.config().stageTagKey],
      provider.config().stage
    );
  });
  it("lives", async function () {
    await provider.listLives();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
  });
  it("project apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
