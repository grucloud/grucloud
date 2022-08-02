const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53HealthCheck", async function () {
  let config;
  let provider;
  let healthCheck;

  before(async function () {
    provider = await AwsProvider({ config });
    healthCheck = provider.getClient({
      groupType: "Route53::HealthCheck",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => healthCheck.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        healthCheck.destroy({
          live: { Id: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        healthCheck.getById({
          Id: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        healthCheck.getByName({
          name: "a-124",
        }),
    ])
  );
});
