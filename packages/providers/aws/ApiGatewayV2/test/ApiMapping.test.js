const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 ApiMapping", async function () {
  let config;
  let provider;
  let apiMapping;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    apiMapping = provider.getClient({
      groupType: "ApiGatewayV2::ApiMapping",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        apiMapping.destroy({
          live: { ApiMappingId: "12345", DomainName: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () => apiMapping.getById({ ApiMappingId: "12345", DomainName: "12345" }),
    ])
  );
});
