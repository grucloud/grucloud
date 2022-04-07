const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("DBProxy", async function () {
  let config;
  let provider;
  let dbProxy;

  before(async function () {
    provider = AwsProvider({ config });
    dbProxy = provider.getClient({ groupType: "RDS::DBProxy" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => dbProxy.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        dbProxy.destroy({
          live: { DBProxyName: "dbProxy-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        dbProxy.getById({
          DBProxyName: "dbProxy-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        dbProxy.getByName({
          name: "dbProxy-12345",
        }),
    ])
  );
});
