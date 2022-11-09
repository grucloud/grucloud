const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53ResolverEndpoint", async function () {
  let config;
  let provider;
  let endpoint;

  before(async function () {
    provider = await AwsProvider({ config });
    endpoint = provider.getClient({ groupType: "Route53Resolver::Endpoint" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => endpoint.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        endpoint.destroy({
          live: { Id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        endpoint.getById({})({
          Id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        endpoint.getByName({
          name: "124",
        }),
    ])
  );
});
