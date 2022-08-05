const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2RouteTable", async function () {
  let config;
  let provider;
  let routeTable;

  before(async function () {
    provider = await AwsProvider({ config });
    routeTable = provider.getClient({
      groupType: "EC2::RouteTable",
    });
    await provider.start();
  });

  it(
    "list",
    pipe([
      () => routeTable.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        routeTable.destroy({
          live: {
            RouteTableId: "rtb-032cb2c8350925850",
          },
        }),
    ])
  );
});
