const assert = require("assert");
const { map, pipe } = require("rubico");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");

describe.skip("AwsS3BucketPerf", async function () {
  let config;
  const types = ["S3Bucket"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("many buckets", async function () {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

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
      const { error } = await provider.planQueryAndApply();
      assert(!error, "planQueryAndApply failed");
    }
    {
      const { error } = await provider.destroyAll({ options: { types } });
      assert(!error, "destroyAll");
    }
  });
});
