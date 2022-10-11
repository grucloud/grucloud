const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MemoryDB User", async function () {
  let config;
  let provider;
  let user;

  before(async function () {
    provider = await AwsProvider({ config });
    user = provider.getClient({
      groupType: "MemoryDB::User",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => user.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        user.destroy({
          live: { UserName: "user-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        user.getById({
          UserName: "user-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        user.getByName({
          UserName: "user-1234",
        }),
    ])
  );
});
