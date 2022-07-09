const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CodePipelinePipeline", async function () {
  let config;
  let provider;
  let pipeline;

  before(async function () {
    provider = AwsProvider({ config });
    pipeline = provider.getClient({
      groupType: "CodePipeline::Pipeline",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => pipeline.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        pipeline.destroy({
          live: { pipeline: { name: "my-pipeline" } },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([() => pipeline.getById({ pipeline: { name: "my-pipeline" } })])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        pipeline.getByName({
          name: "a-124",
        }),
    ])
  );
});
