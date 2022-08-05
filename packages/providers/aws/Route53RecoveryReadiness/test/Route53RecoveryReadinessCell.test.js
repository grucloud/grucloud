const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryReadinessCell", async function () {
  let config;
  let provider;
  let cell;

  before(async function () {
    provider = await AwsProvider({ config });
    cell = provider.getClient({
      groupType: "Route53RecoveryReadiness::Cell",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cell.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cell.destroy({
          live: { CellName: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cell.getById({
          CellName: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cell.getByName({
          name: "a-124",
        }),
    ])
  );
});
