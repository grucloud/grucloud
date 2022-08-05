const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkFirewall Policy", async function () {
  let config;
  let provider;
  let firewallPolicy;

  before(async function () {
    provider = await AwsProvider({ config });
    firewallPolicy = provider.getClient({
      groupType: "NetworkFirewall::Policy",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => firewallPolicy.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        firewallPolicy.destroy({
          live: {
            FirewallPolicyArn:
              "arn:aws:network-firewall:us-east-1:840541460064:firewall-policy/blabla",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        firewallPolicy.getById({
          FirewallPolicyArn:
            "arn:aws:network-firewall:us-east-1:840541460064:firewall-policy/blabla",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        firewallPolicy.getByName({
          name: "a124",
        }),
    ])
  );
});
