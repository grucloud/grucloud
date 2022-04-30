const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2TransitGatewayRouteTable", async function () {
  let config;
  let provider;
  let transitGatewayRouteTable;

  before(async function () {
    provider = AwsProvider({ config });
    transitGatewayRouteTable = provider.getClient({
      groupType: "EC2::TransitGatewayRouteTable",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => transitGatewayRouteTable.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        transitGatewayRouteTable.destroy({
          live: {
            TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        transitGatewayRouteTable.getById({
          TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850",
        }),
    ])
  );
});
