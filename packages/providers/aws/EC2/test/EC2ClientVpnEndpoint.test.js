const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2ClientVpnEndpoint", async function () {
  let config;
  let provider;
  let client;

  before(async function () {
    provider = AwsProvider({ config });
    client = provider.getClient({
      groupType: "EC2::ClientVpnEndpoint",
    });
    await provider.start();
  });

  it(
    "list",
    pipe([
      () => client.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        client.destroy({
          live: {
            ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        client.getById({
          ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
        }),
    ])
  );
  it(
    "getByName with invalid name",
    pipe([
      () =>
        client.getByName({
          name: "a-123",
        }),
    ])
  );
});
