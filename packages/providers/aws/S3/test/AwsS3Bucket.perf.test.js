const assert = require("assert");
const { map, pipe } = require("rubico");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("AwsS3BucketPerf", async function () {
  let config;
  const types = ["Bucket"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("many buckets", async function () {
    const provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
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
        await map(async (bucket) =>
          provider.s3.makeBucket({
            name: bucket,
            properties: () => ({}),
          })
        )(buckets),
    ])(maxBuckets);

    await provider.start();

    const resultApply = await cliCommands.planApply({
      infra: { provider },
      commandOptions: { force: true },
    });
    assert(!resultApply.error);

    const resultDestroy = await cliCommands.planDestroy({
      infra: { provider },
      commandOptions: { force: true, options: { types } },
    });
    assert(!resultDestroy.error);
  });
});
