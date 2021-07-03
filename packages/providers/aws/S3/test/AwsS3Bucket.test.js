const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

const { AwsProvider } = require("../../AwsProvider");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsS3Bucket", async function () {
  let config;
  let provider;
  const types = ["S3Bucket"];
  const bucketPrefix = "grucloud-t-";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();
  });
  after(async () => {});

  it.skip("s3Bucket apply and destroy", async function () {
    const s3Bucket = await provider.s3.makeBucket({
      name: `${bucketPrefix}-basic`,
      properties: () => ({}),
    });

    await testPlanDeploy({ provider, types });

    const s3BucketLive = await s3Bucket.getLive();
    assert(s3BucketLive);
    assert(!s3BucketLive.ACL);

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: s3BucketLive.Tags,
        name: s3Bucket.name,
      })
    );

    await testPlanDestroy({ provider, full: false, types });
  });
});
