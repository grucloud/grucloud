const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe } = require("rubico");

describe("Api Gateway Method", async function () {
  let config;
  let provider;
  let method;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    method = provider.getClient({ groupType: "APIGateway::Method" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        method.destroy({
          live: { restApiId: "12345", resourceId: "12345", httpMethod: "get" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        method.getById({
          restApiId: "12345",
          resourceId: "12345",
          httpMethod: "get",
        }),
    ])
  );
});
