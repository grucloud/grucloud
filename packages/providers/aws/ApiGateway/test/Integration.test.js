const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("Api Gateway Integration", async function () {
  let config;
  let provider;
  let integration;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    integration = provider.getClient({ groupType: "APIGateway::Integration" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        integration.destroy({
          live: { restApiId: "12345", resourceId: "12345", httpMethod: "get" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        integration.getById({
          restApiId: "12345",
          resourceId: "12345",
          httpMethod: "get",
        }),
    ])
  );
});
