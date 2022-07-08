const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe.only("CodeBuildProject", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = AwsProvider({ config });
    cluster = provider.getClient({
      groupType: "CodeBuild::Project",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cluster.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cluster.destroy({
          live: { name: "my-project" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cluster.getById({
          name: "my-project",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "a-124",
        }),
    ])
  );
});
