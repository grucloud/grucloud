const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryReadinessRecoveryGroup", async function () {
  let config;
  let provider;
  let recoveryGroup;

  before(async function () {
    provider = AwsProvider({ config });
    recoveryGroup = provider.getClient({
      groupType: "Route53RecoveryReadiness::RecoveryGroup",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => recoveryGroup.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        recoveryGroup.destroy({
          live: { RecoveryGroupName: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        recoveryGroup.getById({
          RecoveryGroupName: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        recoveryGroup.getByName({
          name: "a-124",
        }),
    ])
  );
});
