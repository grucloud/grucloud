const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2TransitGatewayRoute", async function () {
  let config;
  let provider;
  let transitGatewayRoute;

  before(async function () {
    provider = await AwsProvider({ config });
    transitGatewayRoute = provider.getClient({
      groupType: "EC2::TransitGatewayRoute",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        transitGatewayRoute.destroy({
          live: {
            DestinationCidrBlock: "0.0.0.0/24",
            TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850",
          },
        }),
    ])
  );
  // it(
  //   "getById with invalid id",
  //   pipe([
  //     () =>
  //       transitGatewayRoute.getById({
  //         TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850",
  //       }),
  //   ])
  // );
});
