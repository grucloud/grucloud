const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryReadinessResourceSet", async function () {
  let config;
  let provider;
  let resourceSet;

  before(async function () {
    provider = await AwsProvider({ config });
    resourceSet = provider.getClient({
      groupType: "Route53RecoveryReadiness::ResourceSet",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => resourceSet.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        resourceSet.destroy({
          live: { ResourceSetName: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        resourceSet.getById({})({
          ResourceSetName: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        resourceSet.getByName({
          name: "a-124",
        }),
    ])
  );
});
