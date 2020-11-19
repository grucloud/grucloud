const assert = require("assert");
const path = require("path");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

const bucketName = "grucloud-s3bucket-test-update";
const types = ["S3Bucket", "S3Object"];

const createStack = async ({ config }) => {
  const provider = AwsProvider({
    name: "aws",
    config: config.aws,
  });

  await provider.start();

  const s3Bucket = await provider.makeS3Bucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = await provider.makeS3Object({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(process.cwd(), "examples/aws/s3/fixtures/testFile.txt"),
    }),
  });

  return provider;
};

const createStackNext = async ({ config }) => {
  const provider = AwsProvider({
    name: "aws",
    config: config.aws,
  });

  await provider.start();

  const s3Bucket = await provider.makeS3Bucket({
    name: bucketName,
    properties: () => ({}),
  });

  const s3Object = await provider.makeS3Object({
    name: `file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      source: path.join(
        process.cwd(),
        "examples/aws/s3/fixtures/testFile2.txt"
      ),
    }),
  });

  return provider;
};
describe("AwsS3Object", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
  });

  it.only("s3 object apply, update destroy", async function () {
    const provider = await createStack({ config });

    await testPlanDeploy({ provider, types });

    const providerNext = await createStackNext({ config });
    const plan = await providerNext.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
    const update = plan.resultCreate.plans[0];
    assert.equal(update.action, "UPDATE");

    await testPlanDestroy({ provider, types });
  });
});
