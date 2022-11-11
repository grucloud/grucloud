const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53RecoveryControlConfig", async function () {
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryControlConfig::Cluster",
        livesNotFound: ({ config }) => [
          {
            ClusterArn: `arn:aws:route53-recovery-control::${config.accountId()}:cluster/3011f1ab-0558-4627-a890-cad5e8e7ae8a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ControlPanel", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryControlConfig::ControlPanel",
        livesNotFound: ({ config }) => [
          {
            ControlPanelArn: `arn:aws:route53-recovery-control::${config.accountId()}:controlpanel/a5fccd99254446b4b3d85a6071013c8a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RoutingControl", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryControlConfig::RoutingControl",
        livesNotFound: ({ config }) => [
          {
            RoutingControlArn: `arn:aws:route53-recovery-control::${config.accountId()}:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/routingcontrol/21d6c872221c4961`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SafetyRule", () =>
    pipe([
      () => ({
        groupType: "Route53RecoveryControlConfig::SafetyRule",
        livesNotFound: ({ config }) => [
          {
            AssertionRule: {
              SafetyRuleArn: `arn:aws:route53-recovery-control::${config.accountId()}:controlpanel/b95ba5f33ba04c3ca6dc231654a1604d/safetyrule/3004465f9a384eab`,
            },
          },
        ],
      }),
      awsResourceTest,
    ])());
});
