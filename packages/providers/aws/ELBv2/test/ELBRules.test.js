const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ELB Rules", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    provider = AwsProvider({ config });
    rule = provider.getClient({
      groupType: "ELBv2::Rule",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => rule.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        rule.destroy({
          live: {
            RuleArn:
              "arn:aws:elasticloadbalancing:us-east-1:840541460064:listener-rule/app/load-balancer/e6f97c90654062f0/db2d92e8196bc8c1/b902c6929ac9bcd7",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        rule.getByName({
          name: "invalid-rule",
        }),
    ])
  );
});
