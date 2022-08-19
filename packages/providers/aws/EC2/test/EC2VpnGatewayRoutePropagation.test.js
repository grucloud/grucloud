const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpnGatewayRoutePropagation", async function () {
  let config;
  let provider;
  let vpnGatewayRoutePropagation;

  before(async function () {
    provider = await AwsProvider({ config });
    vpnGatewayRoutePropagation = provider.getClient({
      groupType: "EC2::VpnGatewayRoutePropagation",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        vpnGatewayRoutePropagation.destroy({
          live: {
            RouteTableId: "vpc-123456",
            GatewayId: "vgw-032cb2c8350925850",
          },
        }),
    ])
  );
});
