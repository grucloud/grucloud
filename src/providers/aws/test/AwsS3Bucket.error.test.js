const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");

describe("AwsS3BucketErrors", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("s3Bucket already exist", async function () {
    const provider = await AwsProvider({
      name: "aws",
      config: ConfigLoader({ baseDir: __dirname }),
    });
    await provider.makeS3Bucket({
      name: "bucket",
      properties: () => ({}),
    });

    try {
      await provider.planQueryAndApply();
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.code, "Forbidden");
    }
  });
});
