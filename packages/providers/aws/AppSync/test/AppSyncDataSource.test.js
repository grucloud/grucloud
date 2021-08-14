const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { AppSyncDataSource } = require("../AppSyncDataSource");

describe("AppSyncDataSource", async function () {
  let config;
  let provider;
  let dataSource;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    dataSource = AppSyncDataSource({ config: provider.config });
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
});
