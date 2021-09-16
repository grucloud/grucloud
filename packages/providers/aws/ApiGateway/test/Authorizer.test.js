const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api Gateway Authorizer", async function () {
  let config;
  let provider;
  let autorizer;

  before(async function () {
    provider = AwsProvider({ config });
    autorizer = provider.getClient({ groupType: "APIGateway::Authorizer" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        autorizer.destroy({
          live: { restApiId: "12345", id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        autorizer.getById({
          restApiId: "12345",
          id: "12345",
        }),
    ])
  );
});
