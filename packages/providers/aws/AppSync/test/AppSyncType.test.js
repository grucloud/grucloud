const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("AppSyncType", async function () {
  let config;
  let provider;
  let type;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    type = provider.getClient({ groupType: "AppSync::Type" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        type.destroy({
          live: {
            name: "typeName-no-exist",
            apiId: "12345",
          },
        }),
    ])
  );
});
