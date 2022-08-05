const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2TransitGatewayVpcAttachment", async function () {
  let config;
  let provider;
  let transitGatewayAttachment;

  before(async function () {
    provider = await AwsProvider({ config });
    transitGatewayAttachment = provider.getClient({
      groupType: "EC2::TransitGatewayVpcAttachment",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => transitGatewayAttachment.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );

  it(
    "delete with invalid id",
    pipe([
      () =>
        transitGatewayAttachment.destroy({
          live: {
            TransitGatewayAttachmentId: "tgw-attach-032cb2c8350925850",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        transitGatewayAttachment.getById({
          TransitGatewayAttachmentId: "tgw-attach-032cb2c8350925850",
        }),
    ])
  );
});
