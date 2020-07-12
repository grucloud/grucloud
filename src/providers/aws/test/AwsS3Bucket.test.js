const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsS3 } = require("./AwsTagCheck");

describe("AwsS3Bucket", async function () {
  let config;
  let provider;
  let s3Bucket;
  const bucketName = "grucloud-s3bucket-test";
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config: ConfigLoader({ baseDir: __dirname }),
    });
    s3Bucket = await provider.makeS3Bucket({
      name: bucketName,
      properties: () => ({
        Tagging: {
          TagSet: [
            {
              Key: "Key1",
              Value: "Value1",
            },
            {
              Key: "Key2",
              Value: "Value2",
            },
          ],
        },
      }),
    });

    const { success } = await provider.destroyAll();
    assert(success, "destroyAll failed");
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("s3Bucket name", async function () {
    assert.equal(s3Bucket.name, bucketName);
  });
  it("s3Bucket resolveConfig", async function () {
    const config = await s3Bucket.resolveConfig();
    //assert(config.CidrBlock);
  });
  it("s3Bucket targets", async function () {
    const live = await s3Bucket.getLive();
  });
  it("s3Bucket listLives", async function () {
    const result = await provider.listLives({ types: ["S3Bucket"] });
    assert(result);
  });
  it("s3Bucket apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const s3BucketLive = await s3Bucket.getLive();

    CheckTagsS3({
      config: provider.config(),
      tags: s3BucketLive.TagSet,
      name: s3Bucket.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
