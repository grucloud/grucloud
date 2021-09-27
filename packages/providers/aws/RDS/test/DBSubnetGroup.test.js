const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("DBSubnetGroup", async function () {
  let config;
  let provider;
  let subnetGroup;

  before(async function () {
    provider = AwsProvider({ config });
    subnetGroup = provider.getClient({ groupType: "RDS::DBSubnetGroup" });
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
          live: { DBSubnetGroupName: "instance-12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        subnetGroup.getByName({
          name: "124",
        }),
    ])
  );
});
