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
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      name: "google",
      config: config.google,
    });
    project = await provider.makeProject({ name: projectName });
  });
  after(async () => {});
  it("project config", async function () {
    const config = await project.resolveConfig();
    assert(config);
    assert.equal(config.name, projectName);
    assert.equal(
      config.labels[provider.config().stageTagKey],
      provider.config().stage
    );
  });

  it("project apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
