const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("NetworkFirewall", async function () {
  it("Firewall", () =>
    pipe([
      () => ({
        groupType: "NetworkFirewall::Firewall",
        livesNotFound: ({ config }) => [
          {
            FirewallArn: `arn:aws:network-firewall:${
              config.region
            }:${config.accountId()}:firewall/blabla`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LoggingConfiguration", () =>
    pipe([
      () => ({
        groupType: "NetworkFirewall::LoggingConfiguration",
        livesNotFound: ({ config }) => [
          {
            FirewallArn: `arn:aws:network-firewall:${
              config.region
            }:${config.accountId()}:firewall/blabla`,
            LoggingConfiguration: { LogDestinationConfigs: {} },
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "NetworkFirewall::Policy",
        livesNotFound: ({ config }) => [
          {
            FirewallPolicyArn: `arn:aws:network-firewall:${
              config.region
            }:${config.accountId()}:firewall-policy/blabla`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RuleGroup", () =>
    pipe([
      () => ({
        groupType: "NetworkFirewall::RuleGroup",
        livesNotFound: ({ config }) => [
          {
            RuleGroupArn: `arn:aws:network-firewall:${
              config.region
            }:${config.accountId()}:stateful-rulegroup/blabla`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
