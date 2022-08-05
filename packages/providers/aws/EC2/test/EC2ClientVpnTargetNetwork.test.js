const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2ClientVpnTargetNetwork", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    provider = await AwsProvider({ config });
    rule = provider.getClient({
      groupType: "EC2::ClientVpnTargetNetwork",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        rule.destroy({
          live: {
            ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
            AssociationId: "a-b80a4ff5123",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        rule.getById({
          ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
          AssociationId: "a-b80a4ff5123",
        }),
    ])
  );
});
