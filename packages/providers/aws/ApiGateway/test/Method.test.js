const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe } = require("rubico");

describe.skip("Api Gateway Method", async function () {
  let config;
  let provider;
  let method;

  before(async function () {
    provider = await AwsProvider({ config });
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
        method.getById({})({
          restApiId: "12345",
          resourceId: "12345",
          httpMethod: "get",
        }),
    ])
  );
});
