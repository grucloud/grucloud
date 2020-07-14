const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../../AwsProvider");
const { map, pipe } = require("rubico");

describe("AwsS3BucketPerf", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("many buckets", async function () {
    const provider = await AwsProvider({
      name: "aws",
      config,
    });

    const maxBuckets = 10;
    await pipe([
      (maxBuckets) =>
        Array(maxBuckets)
          .fill("")
          .reduce(
            (acc, value, index) => [...acc, `grucloud-bucket-${index}`],
            []
          ),
      async (buckets) =>
        await map(
          async (bucket) =>
            await provider.makeS3Bucket({
              name: bucket,
              properties: () => ({}),
            })
        )(buckets),
    ])(maxBuckets);

    {
      const { success } = await provider.planQueryAndApply();
      assert(success, "planQueryAndApply failed");
    }
    {
      const { success } = await provider.destroyAll();
      assert(success, "destroyAll");
    }
  });
});
