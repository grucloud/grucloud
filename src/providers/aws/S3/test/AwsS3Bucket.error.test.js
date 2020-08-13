const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../../AwsProvider");
const cliCommands = require("../../../../cli/cliCommands");

describe("AwsS3BucketErrors", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("s3Bucket already exist", async function () {
    const provider = await AwsProvider({
      name: "aws",
      config,
    });
    await provider.makeS3Bucket({
      name: "bucket",
      properties: () => ({}),
    });

    try {
      await cliCommands.planApply({
        infra: { providers: [provider] },
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      const plan = error.results[0].resultQuery.resultCreate.plans[0];
      assert.equal(plan.error.code, "Forbidden");
      assert.equal(plan.resource.name, "bucket");
    }
  });
});
