const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("DBInstance", async function () {
  let config;
  let provider;
  let dbInstance;

  before(async function () {
    provider = await AwsProvider({ config });
    dbInstance = provider.getClient({ groupType: "RDS::DBInstance" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => dbInstance.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        dbInstance.destroy({
          live: { DBInstanceIdentifier: "instance-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        dbInstance.getById({
          DBInstanceIdentifier: "instance-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        dbInstance.getByName({
          name: "124",
        }),
    ])
  );
});
