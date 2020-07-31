const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../../AwsProvider");

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

    const plan = await provider.planQuery();
    assert(plan.error);
  });
});
