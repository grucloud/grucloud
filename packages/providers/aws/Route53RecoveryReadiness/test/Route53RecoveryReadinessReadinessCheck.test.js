const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryReadinessReadinessCheck", async function () {
  let config;
  let provider;
  let readinessCheck;

  before(async function () {
    provider = await AwsProvider({ config });
    readinessCheck = provider.getClient({
      groupType: "Route53RecoveryReadiness::ReadinessCheck",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => readinessCheck.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        readinessCheck.destroy({
          live: { ReadinessCheckName: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        readinessCheck.getById({})({
          ReadinessCheckName: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        readinessCheck.getByName({
          name: "a-124",
        }),
    ])
  );
});
