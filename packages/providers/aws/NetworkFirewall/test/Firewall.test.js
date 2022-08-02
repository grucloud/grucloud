const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkFirewall Firewall", async function () {
  let config;
  let provider;
  let firewall;

  before(async function () {
    provider = await AwsProvider({ config });
    firewall = provider.getClient({ groupType: "NetworkFirewall::Firewall" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => firewall.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        firewall.destroy({
          live: {
            FirewallArn:
              "arn:aws:network-firewall:us-east-1:840541460064:firewall/blabla",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        firewall.getById({
          FirewallArn:
            "arn:aws:network-firewall:us-east-1:840541460064:firewall/blabla",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        firewall.getByName({
          name: "a124",
        }),
    ])
  );
});
