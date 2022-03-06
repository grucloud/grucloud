const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("AppSyncDataSource", async function () {
  let config;
  let provider;
  let dataSource;

  before(async function () {
    provider = AwsProvider({ config });
    dataSource = provider.getClient({ groupType: "AppSync::DataSource" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        dataSource.destroy({
          live: {
            name: "datasource-no-exist",
            apiId: "12345",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        dataSource.getById({
          name: "datasource-no-exist",
          apiId: "12345",
        }),
    ])
  );
});
