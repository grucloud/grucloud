const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpnGatewayAttachment", async function () {
  let config;
  let provider;
  let vpnGatewayAttachment;

  before(async function () {
    provider = await AwsProvider({ config });
    vpnGatewayAttachment = provider.getClient({
      groupType: "EC2::VpnGatewayAttachment",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        vpnGatewayAttachment.destroy({
          live: {
            VpcId: "vpc-123456",
            VpnGatewayId: "vgw-032cb2c8350925850",
          },
        }),
    ])
  );
});
