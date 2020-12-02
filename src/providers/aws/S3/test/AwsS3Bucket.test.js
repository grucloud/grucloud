const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsS3Bucket", async function () {
  let config;
  let provider;
  const types = ["S3Bucket"];
  const bucketPrefix = "grucloud-t-";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();
  });
  after(async () => {});

  it.skip("s3Bucket apply and destroy", async function () {
    const s3Bucket = await provider.makeS3Bucket({
      name: `${bucketPrefix}-basic`,
      properties: () => ({}),
    });

    await testPlanDeploy({ provider, types });

    const s3BucketLive = await s3Bucket.getLive();
    assert(s3BucketLive);
    assert(!s3BucketLive.ACL);

    CheckAwsTags({
      config: provider.config(),
      tags: s3BucketLive.Tags,
      name: s3Bucket.name,
    });

    await testPlanDestroy({ provider, full: false, types });
  });
});
