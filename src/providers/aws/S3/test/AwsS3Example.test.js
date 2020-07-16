const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsS3 } = require("../../AwsTagCheck");
const createStack = require("../../../../../examples/aws/s3/iac");
describe("AwsS3Bucket Example", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/s3" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("run s3 example", async function () {
    const stack = await createStack({ config });
    const provider = stack.providers[0];
    const { success } = await provider.destroyAll();
    assert(success, "destroyAll failed");
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider, full: false });
  });
});
