const assert = require("assert");
const { createStack } = require("./MockStack");
const { ConfigLoader } = require("@grucloud/core");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core").E2ETestUtils;

describe.skip("MockProvider e2e", async function () {
  let stack;
  let provider;
  let config;
  before(async () => {
    config = ConfigLoader({ baseDir: __dirname });
    stack = await createStack({
      config,
    });
    provider = stack.provider;
  });
  after(async () => {});

  it("LifeCycle", async function () {
    await testPlanDeploy({ provider, full: true });
    await testPlanDestroy({ provider, full: true });
  });
});
