const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MemoryDB SubnetGroup", async function () {
  let config;
  let provider;
  let subnetGroup;

  before(async function () {
    provider = await AwsProvider({ config });
    subnetGroup = provider.getClient({
      groupType: "MemoryDB::SubnetGroup",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => subnetGroup.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        subnetGroup.destroy({
          live: { Name: "subnetGroup-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        subnetGroup.getById({
          Name: "subnetGroup-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        subnetGroup.getByName({
          Name: "subnetGroup-1234",
        }),
    ])
  );
});
