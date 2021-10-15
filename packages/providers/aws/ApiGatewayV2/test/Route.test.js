const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 Route", async function () {
  let config;
  let provider;
  let route;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    route = provider.getClient({ groupType: "ApiGatewayV2::Route" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        route.destroy({
          live: { ApiId: "12345", RouteId: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([() => route.getById({ ApiId: "12345", RouteId: "12345" })])
  );
});
