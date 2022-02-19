const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ELB TargetGroup", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    provider = AwsProvider({ config });
    rule = provider.getClient({
      groupType: "ELBv2::TargetGroup",
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
            TargetGroupArn:
              "arn:aws:elasticloadbalancing:us-east-1:840541460064:targetgroup/target-group-web/6d67bc913cf24fdd",
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
