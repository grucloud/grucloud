const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("GlueJob", async function () {
  let config;
  let provider;
  let job;

  before(async function () {
    provider = AwsProvider({ config });
    job = provider.getClient({ groupType: "Glue::Job" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => job.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        job.destroy({
          live: { Name: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        job.getById({
          Name: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        job.getByName({
          name: "124",
        }),
    ])
  );
});
