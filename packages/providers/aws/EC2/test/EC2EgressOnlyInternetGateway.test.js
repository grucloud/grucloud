const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe.only("EC2 EgressOnlyInternetGateway", async function () {
  let config;
  let provider;
  let eoig;

  before(async function () {
    provider = AwsProvider({ config });
    eoig = provider.getClient({
      groupType: "EC2::EgressOnlyInternetGateway",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => eoig.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        eoig.destroy({
          live: {
            EgressOnlyInternetGatewayId: "eigw-0214d5aba979cedf1",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        eoig.getById({
          EgressOnlyInternetGatewayId: "eigw-0214d5aba979cedf1",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        eoig.getByName({
          name: "a123",
        }),
    ])
  );
});
