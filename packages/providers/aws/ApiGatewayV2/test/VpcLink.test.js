const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 VpcLink", async function () {
  let config;
  let provider;
  let vpcLink;

  before(async function () {
    provider = await AwsProvider({ config });
    vpcLink = provider.getClient({
      groupType: "ApiGatewayV2::VpcLink",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => vpcLink.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        vpcLink.destroy({
          live: { VpcLinkId: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([() => vpcLink.getById({})({ VpcLinkId: "12345" })])
  );
});
