const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CodeBuildProject", async function () {
  let config;
  let provider;
  let project;

  before(async function () {
    provider = AwsProvider({ config });
    project = provider.getClient({
      groupType: "CodeBuild::Project",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => project.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        project.destroy({
          live: { name: "my-project" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        project.getById({
          name: "my-project",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        project.getByName({
          name: "a-124",
        }),
    ])
  );
});
