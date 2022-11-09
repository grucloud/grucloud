const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api Gateway ApiKey", async function () {
  let config;
  let provider;
  let apiKey;

  before(async function () {
    provider = await AwsProvider({ config });
    apiKey = provider.getClient({ groupType: "APIGateway::ApiKey" });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => apiKey.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        apiKey.destroy({
          live: { id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        apiKey.getById({})({
          id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        apiKey.getByName({
          name: "12345",
        }),
    ])
  );
});
