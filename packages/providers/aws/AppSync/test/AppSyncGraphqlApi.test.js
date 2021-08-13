const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { AppSyncGraphqlApi } = require("../AppSyncGraphqlApi");

describe("AppSynGraphqlApi", async function () {
  let config;
  let provider;
  let graphqlApi;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    graphqlApi = AppSyncGraphqlApi({ config: provider.config });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        graphqlApi.destroy({
          live: { apiId: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        graphqlApi.getByName({
          name: "124",
        }),
    ])
  );
});
