const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 IpamPoolCidr", async function () {
  let config;
  let provider;
  let ipamPoolCidr;

  before(async function () {
    provider = await AwsProvider({ config });
    ipamPoolCidr = provider.getClient({
      groupType: "EC2::IpamPoolCidr",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        ipamPoolCidr.destroy({
          live: {
            IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx",
            Cidr: "10.0.0.0/24",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ipamPoolCidr.getById({})({
          IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx",
          Cidr: "10.0.0.0/24",
        }),
    ])
  );
});
