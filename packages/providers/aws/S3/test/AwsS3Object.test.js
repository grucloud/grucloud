const assert = require("assert");
const path = require("path");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const cliCommands = require("@grucloud/core/cli/cliCommands");

const bucketName = "grucloud-s3bucket-test-update";
const types = ["S3Bucket", "S3Object"];

const createStack = async ({ config }) => {
  const provider = AwsProvider({
    config: () => ({ projectName: "gru-test" }),
  });

  const s3Bucket = provider.s3.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = provider.s3.makeObject({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(process.cwd(), "./S3/test/fixtures/testFile.txt"),
    }),
  });

  return provider;
};

const createStackNext = async ({ config }) => {
  const provider = AwsProvider({
    config: () => ({ projectName: "gru-test" }),
  });

  const s3Bucket = provider.s3.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = provider.s3.makeObject({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(process.cwd(), "./S3/test/fixtures/testFile2.txt"),
    }),
  });

  return provider;
};
describe("AwsS3Object", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });

  it("s3 object apply, update destroy", async function () {
    const provider = await createStack({ config });

    await testPlanDeploy({ provider, types });

    const providerNext = await createStackNext({ config });

    {
      const result = await cliCommands.planQuery({
        infra: { provider: providerNext },
        commandOptions: {},
      });

      assert(!result.error);
      const plan = result.resultQuery.results[0];
      assert.equal(plan.resultDestroy.length, 0);
      assert.equal(plan.resultCreate.length, 1);
      const update = plan.resultCreate[0];
      assert.equal(update.action, "UPDATE");
    }

    await testPlanDestroy({ provider, types });
  });
});
