const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("Api Gateway V2", async function () {
  let config;
  let provider;
  let api;

  before(async function () {
    provider = await AwsProvider({ config });
    api = provider.getClient({ groupType: "ApiGatewayV2::Api" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        api.destroy({
          live: { ApiId: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        api.getByName({
          name: "124",
        }),
    ])
  );
});
