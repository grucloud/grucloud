const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpnConnectionRoute", async function () {
  let config;
  let provider;
  let vpnConnectionRoute;

  before(async function () {
    provider = await AwsProvider({ config });
    vpnConnectionRoute = provider.getClient({
      groupType: "EC2::VpnConnectionRoute",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        vpnConnectionRoute.destroy({
          live: {
            VpnConnectionId: "vgw-032cb2c8350925850",
            DestinationCidrBlock: "192.168.0.0/24",
          },
        }),
    ])
  );
});
