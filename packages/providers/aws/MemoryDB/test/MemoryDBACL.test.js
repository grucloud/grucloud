const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MemoryDB ACL", async function () {
  let config;
  let provider;
  let acl;

  before(async function () {
    provider = await AwsProvider({ config });
    acl = provider.getClient({
      groupType: "MemoryDB::ACL",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => acl.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        acl.destroy({
          live: { Name: "acl-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        acl.getById({
          Name: "acl-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        acl.getByName({
          ACLName: "acl-1234",
        }),
    ])
  );
});
