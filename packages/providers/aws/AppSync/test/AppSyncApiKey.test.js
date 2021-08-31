const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { AppSyncApiKey } = require("../AppSyncApiKey");

describe("AppSyncApiKey", async function () {
  let config;
  let provider;
  let apiKey;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    apiKey = provider.getClient({ groupType: "AppSync::ApiKey" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        apiKey.destroy({
          live: { id: "1234", apiId: "12345" },
        }),
    ])
  );
});
