const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkFirewall RuleGroup", async function () {
  let config;
  let provider;
  let ruleGroup;

  before(async function () {
    provider = AwsProvider({ config });
    ruleGroup = provider.getClient({
      groupType: "NetworkFirewall::RuleGroup",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => ruleGroup.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        ruleGroup.destroy({
          live: {
            RuleGroupArn:
              "arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/blabla",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ruleGroup.getById({
          RuleGroupArn:
            "arn:aws:network-firewall:us-east-1:840541460064:stateful-rulegroup/blabla",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        ruleGroup.getByName({
          name: "a124",
        }),
    ])
  );
});
