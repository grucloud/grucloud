const assert = require("assert");
const { createStack } = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const { ConfigLoader } = require("ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
  isPlanEmpty,
} = require("test/E2ETestUtils");

//const { tos } = require("../../../tos");

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
