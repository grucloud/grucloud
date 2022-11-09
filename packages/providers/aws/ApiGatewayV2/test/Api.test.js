const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 Api", async function () {
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
    "getById with invalid id",
    pipe([() => api.getById({})({ ApiId: "12345" })])
  );
});
