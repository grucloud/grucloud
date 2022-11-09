const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigSafetyRule", async function () {
  let config;
  let provider;
  let safetyRule;

  before(async function () {
    provider = await AwsProvider({ config });
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
          live: {
            AssertionRule: {
              SafetyRuleArn:
                "arn:aws:route53-recovery-control::840541460064:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/safetyrule/3004465f9a384eab",
            },
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        safetyRule.getById({})({
          AssertionRule: {
            SafetyRuleArn:
              "arn:aws:route53-recovery-control::840541460064:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/safetyrule/3004465f9a384eab",
          },
        }),
    ])
  );
});
