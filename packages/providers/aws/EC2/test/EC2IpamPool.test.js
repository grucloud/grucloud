const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 IpamPool", async function () {
  let config;
  let provider;
  let ipamPool;

  before(async function () {
    provider = await AwsProvider({ config });
    ipamPool = provider.getClient({
      groupType: "EC2::IpamPool",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => ipamPool.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        ipamPool.destroy({
          live: {
            IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ipamPool.getById({
          IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        ipamPool.getByName({
          name: "a123",
        }),
    ])
  );
});
