const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53ResolverRule", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    provider = await AwsProvider({ config });
    rule = provider.getClient({ groupType: "Route53Resolver::Rule" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => rule.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        rule.destroy({
          live: { Id: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        rule.getById({})({
          Id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        rule.getByName({
          name: "124",
        }),
    ])
  );
});
