const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpnGateway", async function () {
  let config;
  let provider;
  let vpnGateway;

  before(async function () {
    provider = await AwsProvider({ config });
    vpnGateway = provider.getClient({
      groupType: "EC2::VpnGateway",
    });
    await provider.start();
  });

  it(
    "list",
    pipe([
      () => vpnGateway.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        vpnGateway.destroy({
          live: {
            VpnGatewayId: "cgw-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        vpnGateway.getById({})({
          VpnGatewayId: "cgw-032cb2c8350925850",
        }),
    ])
  );
});
