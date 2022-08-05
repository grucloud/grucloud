const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CodeDeployApp", async function () {
  let config;
  let provider;
  let app;

  before(async function () {
    provider = await AwsProvider({ config });
    app = provider.getClient({
      groupType: "CodeDeploy::Application",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => app.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        app.destroy({
          live: { applicationName: "my-project" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        app.getById({
          applicationName: "my-project",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        app.getByName({
          name: "a-124",
        }),
    ])
  );
});
