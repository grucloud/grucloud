const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");

describe("RestApi", async function () {
  let config;
  let provider;
  let restApi;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    restApi = provider.getClient({ groupType: "APIGateway::RestApi" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        restApi.destroy({
          live: { id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        restApi.getById({
          id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        restApi.getByName({
          name: "124",
        }),
    ])
  );
});
