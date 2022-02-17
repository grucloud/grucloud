const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Subnet", async function () {
  let config;
  let provider;
  let subnet;

  before(async function () {
    provider = AwsProvider({ config });
    subnet = provider.getClient({
      groupType: "EC2::Subnet",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => subnet.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        subnet.destroy({
          live: {
            SubnetId: "subnet-05a750592a3c77058",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        subnet.getByName({
          name: "invalid-subnet-id",
        }),
    ])
  );
});
