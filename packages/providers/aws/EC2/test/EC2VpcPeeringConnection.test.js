const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2VpcPeeringConnection", async function () {
  let config;
  let provider;
  let vpcPeeringConnection;

  before(async function () {
    provider = await AwsProvider({ config });
    vpcPeeringConnection = provider.getClient({
      groupType: "EC2::VpcPeeringConnection",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => vpcPeeringConnection.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        vpcPeeringConnection.destroy({
          live: {
            VpcPeeringConnectionId: "pcx-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        vpcPeeringConnection.getById({})({
          VpcPeeringConnectionId: "pcx-032cb2c8350925850",
        }),
    ])
  );
});
