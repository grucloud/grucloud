const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe.only("GcpProject", async function () {
  const projectName = "project-test";
  let config;
  let provider;
  let project;
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
    project = await provider.makeProject({ name: projectName });

    const { success } = await provider.destroyAll();
    assert(success);
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
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("project apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
