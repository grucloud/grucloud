const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 Integration", async function () {
  let config;
  let provider;
  let integration;

  before(async function () {
    provider = await AwsProvider({ config });
    integration = provider.getClient({
      groupType: "ApiGatewayV2::Integration",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        integration.destroy({
          live: { ApiId: "12345", IntegrationId: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () => integration.getById({ ApiId: "12345", IntegrationId: "12345" }),
    ])
  );
});
