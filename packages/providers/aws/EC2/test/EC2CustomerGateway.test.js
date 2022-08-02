const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2CustomerGateway", async function () {
  let config;
  let provider;
  let customerGateway;

  before(async function () {
    provider = await AwsProvider({ config });
    customerGateway = provider.getClient({
      groupType: "EC2::CustomerGateway",
    });
    await provider.start();
  });

  it(
    "list",
    pipe([
      () => customerGateway.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        customerGateway.destroy({
          live: {
            CustomerGatewayId: "cgw-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        customerGateway.getById({
          CustomerGatewayId: "cgw-032cb2c8350925850",
        }),
    ])
  );
});
