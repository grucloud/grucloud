const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigSafetyRule", async function () {
  let config;
  let provider;
  let safetyRule;

  before(async function () {
    provider = AwsProvider({ config });
    safetyRule = provider.getClient({
      groupType: "Route53RecoveryControlConfig::SafetyRule",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        safetyRule.destroy({
          live: { SafetyRuleArn: "arn:aws:a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        safetyRule.getById({
          SafetyRuleArn: "a-12345",
        }),
    ])
  );
});
