const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53Resolver", async function () {
  it.skip("Config", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Config",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("DnsConfig", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::DnsConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Endpoint", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Endpoint",
        livesNotFound: ({ config }) => [{ Id: "12345" }],
      }),
      awsResourceTest,
    ])());
  it.skip("FirewallConfig", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FirewallDomainList", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallDomainList",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FirewallRule", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRule",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FirewallRuleGroup", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRuleGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FirewallRuleAssociation", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRuleAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Rule",
        livesNotFound: ({ config }) => [{ Id: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("RuleAssociation", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::RuleAssociation",
        livesNotFound: ({ config }) => [
          { Id: "12345", ResolverRuleId: "12345", VPCId: "vpc-xx" },
        ],
      }),
      awsResourceTest,
    ])());
});
