const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 Ipam", async function () {
  let config;
  let provider;
  let ipam;

  before(async function () {
    provider = AwsProvider({ config });
    ipam = provider.getClient({
      groupType: "EC2::Ipam",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => ipam.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        ipam.destroy({
          live: {
            IpamId: "ipam-xxxxxxxxxxxxxxxxx",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ipam.getById({
          IpamId: "ipam-xxxxxxxxxxxxxxxxx",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        ipam.getByName({
          name: "a123",
        }),
    ])
  );
});
