const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe.skip("Api Gateway Resource", async function () {
  let config;
  let provider;
  let resource;

  before(async function () {
    provider = AwsProvider({ config });
    resource = provider.getClient({ groupType: "APIGateway::Resource" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        resource.destroy({
          live: { restApiId: "12345", id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        resource.getById({
          restApiId: "12345",
          id: "12345",
        }),
    ])
  );
});
