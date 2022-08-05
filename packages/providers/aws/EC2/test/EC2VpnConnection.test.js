const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpnConnection", async function () {
  let config;
  let provider;
  let vpnConnection;

  before(async function () {
    provider = await AwsProvider({ config });
    vpnConnection = provider.getClient({
      groupType: "EC2::VpnConnection",
    });
    await provider.start();
  });

  it(
    "list",
    pipe([
      () => vpnConnection.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        vpnConnection.destroy({
          live: {
            VpnConnectionId: "vgw-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        vpnConnection.getById({
          VpnConnectionId: "vgw-032cb2c8350925850",
        }),
    ])
  );
});
