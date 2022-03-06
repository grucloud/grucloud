const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ECSCapacityProvider", async function () {
  let config;
  let provider;
  let capacityprovider;

  before(async function () {
    provider = AwsProvider({ config });
    capacityprovider = provider.getClient({
      groupType: "ECS::CapacityProvider",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => capacityprovider.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        capacityprovider.destroy({
          live: { name: "12345" },
          lives: provider.lives,
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        capacityprovider.getByName({
          name: "124",
        }),
    ])
  );
});
