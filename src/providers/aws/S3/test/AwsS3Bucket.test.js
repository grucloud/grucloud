const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsS3 } = require("../../AwsTagCheck");

describe("AwsS3Bucket", async function () {
  let config;
  let provider;
  const bucketPrefix = "grucloud-s3bucket-test";

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

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("s3Bucket apply and destroy", async function () {
    const s3Bucket = await provider.makeS3Bucket({
      name: `${bucketPrefix}-basic`,
      properties: () => ({}),
    });

    await testPlanDeploy({ provider });

    const s3BucketLive = await s3Bucket.getLive();
    assert(s3BucketLive);
    assert(!s3BucketLive.ACL);

    CheckTagsS3({
      config: provider.config(),
      tags: s3BucketLive.Tagging.TagSet,
      name: s3Bucket.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
