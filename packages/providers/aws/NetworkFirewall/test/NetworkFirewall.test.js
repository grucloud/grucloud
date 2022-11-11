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
            FirewallArn: `arn:aws:network-firewall:us-east-1:${config.accountId()}:firewall/blabla`,
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
            FirewallPolicyArn: `arn:aws:network-firewall:us-east-1:${config.accountId()}:firewall-policy/blabla`,
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
            RuleGroupArn: `arn:aws:network-firewall:us-east-1:${config.accountId()}:stateful-rulegroup/blabla`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
