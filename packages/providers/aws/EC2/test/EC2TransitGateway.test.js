const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2TransitGateway", async function () {
  let config;
  let provider;
  let transitGateway;

  before(async function () {
    provider = AwsProvider({ config });
    transitGateway = provider.getClient({
      groupType: "EC2::TransitGateway",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => transitGateway.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        transitGateway.destroy({
          live: {
            TransitGatewayId: "tgw-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        transitGateway.getById({
          TransitGatewayId: "tgw-032cb2c8350925850",
        }),
    ])
  );
});
