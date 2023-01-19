const assert = require("assert");
const { map, pipe } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe.skip("AwsS3BucketPerf", async function () {
  let config;
  const types = ["Bucket"];
  after(async () => {});

  // it.skip("many buckets", async function () {
  //   const provider = await AwsProvider({
  //     name: "aws",
  //     config: () => ({ projectName: "gru-test" }),
  //   });
  //   const cli = await Cli({
  //     createStack: () => ({
  //       provider,
  //     }),
  //   });
  //   const maxBuckets = 10;
  //   await pipe([
  //     (maxBuckets) =>
  //       Array(maxBuckets)
  //         .fill("")
  //         .reduce(
  //           (acc, value, index) => [...acc, `grucloud-bucket-${index}`],
  //           []
  //         ),
  //     async (buckets) =>
  //       await map(async (bucket) =>
  //         provider.S3.makeBucket({
  //           name: bucket,
  //           properties: () => ({}),
  //         })
  //       )(buckets),
  //   ])(maxBuckets);

  //   await provider.start();

  //   const resultApply = await cli.planApply({
  //     commandOptions: { force: true },
  //   });
  //   assert(!resultApply.error);

  //   const resultDestroy = await cli.planDestroy({
  //     commandOptions: { force: true, options: { types } },
  //   });
  //   assert(!resultDestroy.error);
  // });
});
